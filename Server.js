import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log key presence on startup
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? `Present (${process.env.GEMINI_API_KEY.slice(0, 8)}...)` : 'MISSING');
console.log('Crop.Health Key:', process.env.CROP_HEALTH_API_KEY ? 'Present' : 'Not set (Gemini Vision will be used)');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseKey ? 'Present' : 'MISSING');
console.log('Supabase Service Role Key:', supabaseServiceKey ? 'Present' : 'MISSING - Using admin API requires this');

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

// ==================== AUTH ENDPOINTS ====================

/**
 * SIGNUP Endpoint
 * POST /api/auth/signup
 * Body: { email, password, name }
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user in Supabase Auth using Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Insert user into users table — use Admin client to bypass RLS
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          created_at: new Date(),
        },
      ])
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: authData.user.id,
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * LOGIN Endpoint
 * POST /api/auth/login
 * Body: { email, password }
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Step 1: Try to sign in
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Step 2: If email not confirmed, find the user in Auth and auto-confirm
    if (authError?.code === 'email_not_confirmed') {
      console.log(`Auto-confirming email for ${email}...`);

      // Find user directly from Supabase Auth (bypasses users table)
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const authUser = listData?.users?.find(u => u.email === email);

      if (authUser) {
        // Confirm the email
        await supabaseAdmin.auth.admin.updateUserById(authUser.id, { email_confirm: true });
        console.log(`Email confirmed for ${email}, retrying login...`);

        // Retry login
        const retry = await supabase.auth.signInWithPassword({ email, password });
        authData = retry.data;
        authError = retry.error;
      }
    }

    if (authError) {
      console.error('Login auth error:', authError);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Step 3: Fetch user profile from users table
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (dbError) {
      console.error('Login db error:', dbError);
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: userData || { id: authData.user.id, email },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * LOGOUT Endpoint
 * POST /api/auth/logout
 */
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * CHANGE PASSWORD Endpoint
 * PATCH /api/auth/change-password
 * Body: { currentPassword, newPassword }
 * Header: Authorization: Bearer {access_token}
 */
app.patch('/api/auth/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CONTACT ENDPOINT ====================

/**
 * CONTACT Endpoint
 * POST /api/contact
 * Body: { name, email, message }
 */
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Store the contact message in the database
    const { data, error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message, created_at: new Date() }])
      .select();

    if (dbError) {
      // Table may not exist yet — still acknowledge receipt gracefully
      console.warn('Contact DB insert warning (table may not exist):', dbError.message);
    }

    console.log(`📨 Contact message from ${name} <${email}>`);
    return res.status(200).json({ message: 'Message received. We will get back to you soon!' });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== DISEASE DETECTION ENDPOINT ====================

// Multer: store uploaded image in memory (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are accepted'));
    }
    cb(null, true);
  },
});

/**
 * DETECT Endpoint
 * POST /api/detect
 * Body: multipart/form-data  { image: <file> }
 * Returns: { diseaseName, severity, confidence, isHealthy, description,
 *            symptoms[], cure[], precautions[], organicRemedies[], spreadToHumans }
 */
app.post('/api/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const cropHealthKey = process.env.CROP_HEALTH_API_KEY;

    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key not configured. Add GEMINI_API_KEY to .env' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // ── STEP 1: Identify disease via crop.health (or Gemini Vision fallback) ──
    let diseaseName = null;
    let confidence = 0;
    let isHealthy = false;

    const hasCropHealthKey = cropHealthKey && cropHealthKey !== 'your_crop_health_api_key_here';

    if (hasCropHealthKey) {
      console.log('Calling crop.health API...');
      try {
        const cropRes = await fetch('https://crop.health/api/v1/identification', {
          method: 'POST',
          headers: {
            'Api-Key': cropHealthKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ images: [dataUri] }),
        });

        if (cropRes.ok) {
          const cropData = await cropRes.json();
          const healthy = cropData.result?.is_healthy?.probability ?? 0;
          const diseases = cropData.result?.disease?.suggestions ?? [];

          if (healthy > 0.6 || diseases.length === 0) {
            isHealthy = true;
            diseaseName = 'Healthy Plant';
            confidence = Math.round(healthy * 100);
          } else {
            diseaseName = diseases[0].name;
            confidence = Math.round(diseases[0].probability * 100);
          }
          console.log(`crop.health result: ${diseaseName} (${confidence}%)`);
        } else {
          console.warn('crop.health API error:', cropRes.status);
        }
      } catch (cropErr) {
        console.warn('crop.health call failed, falling back to Gemini Vision:', cropErr.message);
      }
    }

    // ── STEP 2: Ask Gemini for full disease details ──────────────────────────
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${geminiKey}`;

    let geminiResult = null;

    // Build the correct prompt depending on whether crop.health gave us a name
    const geminiBody = diseaseName
      // Mode A: crop.health identified a disease → ask for details in text
      ? {
        contents: [{
          parts: [{
            text: `You are an expert plant pathologist assisting Indian farmers.
${isHealthy
                ? `A crop health AI confirmed this plant looks HEALTHY with ${confidence}% confidence.`
                : `A crop health AI identified "${diseaseName}" with ${confidence}% confidence.`
              }
Provide comprehensive information for the farmer.
Respond ONLY with valid JSON — no markdown, no extra text — in exactly this format:
{
  "diseaseName": "${diseaseName}",
  "severity": ${isHealthy ? '"None"' : '"Low"|"Medium"|"High"'},
  "confidence": ${confidence},
  "isHealthy": ${isHealthy},
  "description": "2-3 sentence explanation of the disease or health status",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "cure": ["step1", "step2", "step3", "step4"],
  "precautions": ["precaution1", "precaution2", "precaution3"],
  "organicRemedies": ["remedy1", "remedy2"],
  "spreadToHumans": false
}`,
          }],
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }
      // Mode B: No crop.health key → send image to Gemini Vision
      : {
        contents: [{
          parts: [
            {
              inline_data: { mime_type: mimeType, data: base64Image },
            },
            {
              text: `You are an expert plant pathologist assisting Indian farmers.
Analyze this crop/plant image and identify any diseases present.
If the plant looks healthy, report it as such.
Respond ONLY with valid JSON — no markdown, no extra text — in exactly this format:
{
  "diseaseName": "Disease Name or Healthy Plant",
  "severity": "None|Low|Medium|High",
  "confidence": 85,
  "isHealthy": false,
  "description": "2-3 sentence explanation",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "cure": ["step1", "step2", "step3", "step4"],
  "precautions": ["precaution1", "precaution2", "precaution3"],
  "organicRemedies": ["remedy1", "remedy2"],
  "spreadToHumans": false
}`,
            },
          ],
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      };

    console.log('Calling Gemini API...');
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      let friendlyMsg = 'Gemini API request failed.';
      try {
        const errJson = JSON.parse(errText);
        friendlyMsg = errJson?.error?.message || friendlyMsg;
      } catch (_) { }
      return res.status(502).json({ error: `Gemini: ${friendlyMsg}` });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Extract pure JSON (Gemini sometimes wraps in ```json ... ```)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        geminiResult = JSON.parse(jsonMatch[0]);
        console.log(`Gemini identified: ${geminiResult.diseaseName}`);
      } catch (parseErr) {
        console.error('Failed to parse Gemini JSON:', parseErr.message);
      }
    }

    // ── STEP 3: Return result ─────────────────────────────────────────────────
    if (!geminiResult) {
      // Fallback if Gemini returned unexpected format
      return res.status(200).json({
        diseaseName: diseaseName ?? 'Unable to identify',
        severity: 'Unknown',
        confidence,
        isHealthy,
        description: 'The AI could not provide detailed information. Please consult a local agricultural expert.',
        symptoms: [],
        cure: ['Consult a local agricultural extension officer'],
        precautions: ['Isolate affected plants', 'Monitor regularly'],
        organicRemedies: [],
        spreadToHumans: false,
      });
    }

    return res.status(200).json(geminiResult);

  } catch (error) {
    console.error('Detection error:', error);
    return res.status(500).json({ error: 'Detection failed: ' + error.message });
  }
});

// ==================== TEST ENDPOINTS ====================

app.get('/', (req, res) => {
  res.json({
    message: 'Disease Detection Backend API',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        changePassword: 'PATCH /api/auth/change-password',
      },
      detection: 'POST /api/detect  (multipart/form-data: image)',
      contact: 'POST /api/contact',
      health: 'GET /api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ==================== START SERVER ====================

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful error handling — prevents ugly stack traces on port conflicts
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`   Run: netstat -ano | findstr :${PORT}  to find the process, then kill it.`);
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});
