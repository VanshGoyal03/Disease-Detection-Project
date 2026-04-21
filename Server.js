import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
        authData  = retry.data;
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
