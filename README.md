# Universal Enterprise — Full-Stack Industrial Bearings & Sourcing Platform

An enterprise-grade B2B distribution, quotation, and CRM platform built with **Next.js (App Router, JavaScript/JSX)**, **Node.js & Express.js**, **MongoDB Atlas & Mongoose**, and **Google Gemini AI**.

---

## 🏗️ Architecture Overview

```
                        USER BROWSER
                             │
                             ▼
                    NEXT.JS FRONTEND (Port 3000)
              (JavaScript / JSX / Tailwind CSS)
                             │
                      REST API Calls
                             │
                             ▼
                    NODE.JS + EXPRESS (Port 6060)
                   (JavaScript Backend)
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   MONGODB ATLAS           GEMINI           SERVICES
 (Mongoose Cloud)        (Google AI)        / LOGIC
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript ONLY (`.js`, `.jsx`)
- **Port**: 3000
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for CRM Analytics)
- **Voice Capabilities**: Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Port**: 6060 (Host: `0.0.0.0`)
- **Database**: MongoDB Atlas (Cloud Database) & Mongoose
- **AI Integration**: `@google/genai` (Gemini Flash) with dynamic catalog grounding
- **Security**: Helmet, CORS, Rate Limiting

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=6060
MONGODB_URI=mongodb+srv://ue14email_db_user:4yITHzyDAa1rPHXa@cluster0.pqmpdeb.mongodb.net/universal_enterprise?retryWrites=true&w=majority&appName=Cluster0
HOST=0.0.0.0
GEMINI_API_KEY=
FRONTEND_URL=http://localhost:3000
WHATSAPP_NUMBER=+919900726939
NODE_ENV=development
```

### Frontend (`frontend/.env.local` - Optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:6060
NEXT_PUBLIC_WHATSAPP_NUMBER=+919900726939
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed the MongoDB Database
```bash
npm run seed:backend
```

### 3. Run Development Servers
```bash
npm run dev
```

- Backend API: `http://localhost:6060` (Health check at `http://localhost:6060/api/health`)
- Frontend App: `http://localhost:3000`
