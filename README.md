# Universal Enterprise — Full-Stack Industrial Bearings & Sourcing Platform

An enterprise-grade B2B distribution, quotation, and CRM platform built with **Next.js (App Router, JavaScript/JSX)**, **Node.js & Express.js**, **MongoDB & Mongoose**, and **Google Gemini AI**.

---

## 🏗️ Architecture Overview

```
                        USER BROWSER
                             │
                             ▼
                    NEXT.JS FRONTEND
              (JavaScript / JSX / Tailwind CSS)
                             │
                      REST API Calls
                             │
                             ▼
                    NODE.JS + EXPRESS
                   (JavaScript Backend)
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
       MONGODB             GEMINI           SERVICES
     (Mongoose)           (Google AI)       / LOGIC
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript ONLY (`.js`, `.jsx`)
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Data Visualization**: Recharts (for CRM Analytics)
- **Voice Capabilities**: Browser Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **AI Integration**: `@google/genai` (Gemini 2.5/3.5 Flash) with dynamic catalog grounding
- **Security**: Helmet, CORS, Rate Limiting

---

## 📁 Project Structure

```
universal-enterprise/
├── frontend/                     # Next.js App Router (JavaScript / JSX)
│   ├── app/
│   │   ├── layout.js             # Global shell & providers
│   │   ├── page.js               # Homepage (Hero, Sourcing Engine, Live Matrix Table, Grid)
│   │   ├── globals.css           # Tailwind base & animations
│   │   ├── products/
│   │   │   ├── page.js           # Dedicated catalog filter view
│   │   │   └── [id]/page.js      # Individual product specs & tolerances
│   │   ├── categories/page.js    # 11-category industrial hierarchy
│   │   ├── compare/page.js       # 3-way specification comparison desk
│   │   ├── tracking/page.js      # Logistics milestone tracker
│   │   ├── brands/
│   │   │   ├── page.js           # Brands directory
│   │   │   ├── nsk/page.js       # NSK profile & parts
│   │   │   ├── thk/page.js       # THK LM systems
│   │   │   └── ntn/page.js       # NTN thin-series deep groove bearings
│   │   ├── services/page.js      # Sourcing & engineering capabilities
│   │   ├── about/page.js         # About corporate & ISO 9001:2015
│   │   ├── contact/page.js       # Sourcing hubs (Chennai, Mumbai, Delhi, Kolkata)
│   │   └── crm/page.js           # 11-module CRM Suite & analytics
│   ├── components/               # Pure React JSX components
│   ├── lib/api.js                # Centralized REST API client
│   ├── utils/csvExport.js        # Browser CSV lead export
│   ├── data/categoriesData.js    # Category trees and industrial data
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── backend/                      # Node.js + Express.js REST API
│   ├── server.js                 # HTTP server listener
│   ├── app.js                    # Express app configuration & middleware
│   ├── config/db.js              # Resilient MongoDB Mongoose connection
│   ├── models/                   # Mongoose Schemas (Product, Lead, Customer, Quote, Order, etc.)
│   ├── controllers/              # REST API controllers
│   ├── routes/                   # Express routes
│   ├── services/geminiService.js # AI Sourcing Engine & inventory context injector
│   ├── utils/seedDatabase.js     # Database seeder
│   ├── data/bearingsData.js      # Initial catalog records
│   ├── package.json
│   └── .env.example
│
├── package.json                  # Root runner & convenience scripts
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/universal_enterprise
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
WHATSAPP_NUMBER=+914466867700
NODE_ENV=development
```

### Frontend (`frontend/.env.local` - Optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WHATSAPP_NUMBER=+914466867700
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```
*Or install individually in both `backend/` and `frontend/`:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Seed the MongoDB Database
```bash
npm run seed:backend
```

### 3. Run Development Servers
To run both Backend (`http://localhost:5000`) and Frontend (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

Or run them individually:
- Backend: `npm run dev:backend`
- Frontend: `npm run dev:frontend`

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Paginated search, dimensional tolerance filters, sorting |
| `GET` | `/api/products/:id` | Detailed specification for a part code |
| `GET` | `/api/products/brands` | List all authorized brands |
| `GET` | `/api/products/suggestions` | Fast autocomplete matching |
| `POST`| `/api/products/upload` | Bulk CSV & shorthand parser into database |
| `POST`| `/api/ai/chat` | AI Sourcing Desk with real-time catalog context grounding |
| `POST`| `/api/quotes` | Submit quotation inquiry with WhatsApp / CRM routing |
| `GET` | `/api/quotes/:id` | Quote & dispatch status tracking |
| `GET` | `/api/quotes/by-email` | Customer quotation history lookup |
| `GET` | `/api/orders/:referenceId` | 6-stage milestone delivery tracking |
| `GET` | `/api/leads` | CRM leads collection |
| `POST`| `/api/leads` | Create new procurement lead |
| `GET` | `/api/customers` | CRM enterprise accounts |
| `GET` | `/api/appointments` | Consultation scheduler |
| `GET` | `/api/calls` | AI Voice agent call transcripts |
| `GET` | `/api/workflows` | Configurable automation rules |
| `GET` | `/api/analytics/metrics`| Live KPI and revenue aggregations |
