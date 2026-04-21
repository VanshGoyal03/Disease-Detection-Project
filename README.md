# 🌿 Kisaan Bandhu — AI-Powered Crop Disease Detection

> **Hackathon Project** | Helping Indian farmers detect and treat crop diseases instantly using AI.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react)
![Express](https://img.shields.io/badge/Express-4-black?logo=express)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?logo=supabase)
![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Vision-orange?logo=google)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)

---

## 🌾 Overview

**Kisaan Bandhu** ("Farmer's Friend") is a full-stack web application that empowers Indian farmers to:

1. **Upload or capture a photo** of their crop
2. **Get instant AI diagnosis** — disease name, severity, confidence %
3. **Receive actionable treatment plans** — cure steps, precautions, organic remedies
4. **Chat with an AI assistant** for follow-up questions about the detected disease
5. **Check real-time weather** to assess disease risk in their area

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Disease Detection** | Upload/capture crop photo → Gemini Vision AI identifies disease + full details |
| 💬 **AI Disease Chat** | Context-aware chatbot powered by Gemini SDK, scoped to the detected disease |
| 🌤️ **Weather Widget** | Live weather data (Open-Meteo API) with disease risk assessment |
| 🤖 **General Chatbot** | Kisaan Bandhu AI assistant for general farming questions |
| 🔐 **Authentication** | Signup, Login, Logout, Change Password via Supabase Auth |
| 📨 **Contact Form** | Sends messages to backend, stored in Supabase database |
| 📱 **Responsive UI** | Mobile-friendly glassmorphism design with dark theme |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server (port 5173) |
| TailwindCSS | Styling |
| React Router | Client-side routing |
| `@google/generative-ai` | Gemini SDK for in-browser AI chat |

### Backend
| Technology | Purpose |
|---|---|
| Node.js (ESM) | Runtime |
| Express 4 | REST API server (port 3001) |
| Multer | Image upload handling (in-memory) |
| Supabase JS | Auth + PostgreSQL database |
| Google Gemini API | Plant disease vision analysis |
| Crop.Health API | Optional plant disease identification (fallback to Gemini Vision) |

---

## 📁 Project Structure

```
kisaan-bandhu/
│
├── Server.js                  # Express backend — all API endpoints
├── package.json
├── .env                       # All environment variables (backend + frontend)
├── .gitignore
│
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component + layout
│   │
│   ├── components/
│   │   ├── Navbar.jsx         # Auth modals (login/signup/change-password)
│   │   ├── DiseaseDetector.jsx  # 🌿 MAIN FEATURE — upload/camera + AI analysis + chat
│   │   ├── Chatbot.jsx        # General AI farming assistant
│   │   ├── WeatherWidget.jsx  # Live weather + disease risk
│   │   ├── TipsSidebar.jsx    # Seasonal farming tips
│   │   ├── FormInput.jsx      # Reusable form input component
│   │   └── Modal.jsx          # Reusable modal wrapper
│   │
│   ├── pages/
│   │   ├── Home.jsx           # Landing page
│   │   ├── About.jsx          # About the project
│   │   ├── Info.jsx           # Disease info page
│   │   └── Contact.jsx        # Contact form
│   │
│   └── styles/                # Global CSS
│
└── public/                    # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google AI Studio](https://aistudio.google.com/apikey) Gemini API key (free)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "DIsease Detection Project Hackathon"
npm install
```

### 2. Configure Environment Variables

Copy the example and fill in your keys:

```bash
# Create .env in the project root
```

See [Environment Variables](#-environment-variables) section below.

### 3. Run the Project

You need **two terminals**:

```bash
# Terminal 1 — Backend API server (port 3001)
npm run server
# or: node Server.js

# Terminal 2 — Frontend dev server (port 5173)
npm run dev
```

Open → **http://localhost:5173**

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# ── Supabase ─────────────────────────────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ── Server ───────────────────────────────────────────────────────────
PORT=3001

# ── Gemini AI (backend — disease detection vision) ───────────────────
# Get free key: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key

# ── Crop.Health API (optional) ───────────────────────────────────────
# If not set, Gemini Vision is used directly (works without this)
# Get key: https://crop.health
CROP_HEALTH_API_KEY=your_crop_health_api_key

# ── Frontend (Vite — exposed to browser) ─────────────────────────────
VITE_API_URL=http://localhost:3001
VITE_GEMINI_CHAT_KEY=your_gemini_api_key_for_chat
```

> **Note:** Variables prefixed with `VITE_` are bundled into the browser JavaScript. Do not put secret keys there.

### Supabase Tables Needed

Run these in your Supabase SQL editor:

```sql
-- User profiles table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form messages (optional)
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📡 API Reference

Base URL: `http://localhost:3001`

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | `{ email, password, name }` | Create account |
| `POST` | `/api/auth/login` | `{ email, password }` | Login |
| `POST` | `/api/auth/logout` | — | Logout |
| `PATCH` | `/api/auth/change-password` | `{ currentPassword, newPassword }` | Change password |

### Disease Detection

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/detect` | `multipart/form-data: { image }` | Analyze crop image with Gemini Vision |

**Response:**
```json
{
  "diseaseName": "Late Blight",
  "severity": "High",
  "confidence": 91,
  "isHealthy": false,
  "description": "Late blight is caused by Phytophthora infestans...",
  "symptoms": ["Dark brown lesions on leaves", "White mold on undersides"],
  "cure": ["Apply copper-based fungicide", "Remove infected plant parts"],
  "precautions": ["Avoid overhead watering", "Rotate crops next season"],
  "organicRemedies": ["Neem oil spray (5ml/litre)", "Baking soda solution"],
  "spreadToHumans": false
}
```

### Other

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/contact` | `{ name, email, message }` | Submit contact form |
| `GET` | `/api/health` | — | Server health check |

---

## 🔬 How It Works

### Disease Detection Flow

```
User uploads image
       │
       ▼
POST /api/detect  (multipart/form-data)
       │
       ▼
  Multer reads image → Base64
       │
       ├─── If CROP_HEALTH_API_KEY set:
       │         crop.health API → disease name
       │         → Gemini (text) → full details
       │
       └─── If no Crop.Health key (default):
                 Gemini Vision (image + prompt)
                 → disease name + full details
                 in a single API call
       │
       ▼
JSON response → Frontend result card
```

### Auth Flow

```
Signup → Supabase Auth (email auto-confirmed) → users table insert
Login  → signInWithPassword → JWT session token
       → Token stored in localStorage
       → Used for protected routes
```

---

## 👨‍💻 Team

Built with ❤️ for the Hackathon by **Vansh Goyal**

---

## 📄 License

MIT — free to use, modify, and distribute.
