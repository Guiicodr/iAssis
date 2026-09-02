# 🩺 iAssis — Intelligent Clinical Management

**iAssis** is a full-stack platform for clinical management with profile-based authentication (professional/patient), SOAP electronic health records, digital prescriptions, exam management and an AI triage module.

---

## ✨ Features

### 👨‍⚕️ Professional Module
- **Dashboard** with real-time metrics, charts, activity feed, and live appointment updates
- **Full CRUD** for Patients, Professionals, and Appointments
- **SOAP Electronic Health Record** — structured notes (Subjective, Objective, Assessment, Plan)
- **Digital Prescription** — prescriptions and medical certificates with medications, dosage, and dates
- **Exams & Attachments** — lab results, reports, and documents per patient
- **AI Module** — clinical complaint analysis for triage support
- **Smooth Animations** — staggered card entry, hover effects, floating elements, pulse badges

### 🧑‍🤝‍🧑 Patient Portal
- Track scheduled and completed appointments
- Evolution history (SOAP records)
- Active prescriptions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|---|---|
| **React** | 19.x |
| **Vite** | 8.x |
| **Tailwind CSS** | 4.x |
| **shadcn/ui** (base-ui) | — |
| **React Router** | 7.x |
| **React Hook Form** | 7.x |
| **Zod** | 4.x |
| **Recharts** | 3.x |
| **Sonner** (toasts) | — |
| **Supabase JS** | — |
| **Lucide React** | — |

### Backend (FastAPI — AI module only)
| Technology | Version |
|---|---|
| **Python** | 3.11+ |
| **FastAPI** | 0.141+ |
| **SQLAlchemy** | 2.0+ |
| **PostgreSQL** | — |
| **JWT (python-jose)** | — |

### Infrastructure
| Service | Role |
|---|---|
| **Supabase** | Auth, PostgreSQL database, Row Level Security, Realtime |
| **Vercel** | Frontend deployment |

---

## 📐 Architecture

```
User → Vercel (React SPA) → Supabase (Auth + DB + RLS + Realtime)
                               └── FastAPI (optional, only for AI via OpenAI)
```

The frontend communicates **directly** with Supabase for:
- Authentication (login, registration, session)
- CRUD for all entities (patients, professionals, appointments, records, prescriptions, attachments)
- Realtime (live dashboard updates)
- Row Level Security (each user sees only their own data)

The FastAPI backend is available exclusively for the AI module (symptom analysis with OpenAI).

---

## 📁 Project Structure

```
iassis/
├── frontend/                    # React + Vite (SPA)
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   └── ui/              # shadcn/ui (button, card, input, badge, modal, label)
│   │   ├── contexts/            # AuthContext (session, profile, signUp/signIn/signOut)
│   │   ├── layouts/             # DashboardLayout (sidebar + dark header)
│   │   ├── lib/                 # Utilities (supabaseClient, Zod validations, formatters)
│   │   └── pages/               # Application pages
│   │       ├── Login.jsx
│   │       ├── Cadastro.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Pacientes.jsx
│   │       ├── Profissionais.jsx
│   │       ├── Consultas.jsx
│   │       ├── ProntuarioEletronico.jsx   # SOAP
│   │       ├── PrescricaoDigital.jsx      # Prescriptions/Certificates
│   │       ├── Anexos.jsx                 # Exams/Reports
│   │       ├── IA.jsx                     # Triage
│   │       ├── Perfil.jsx
│   │       └── PortalPaciente.jsx
│   └── package.json
│
├── backend/                     # FastAPI (AI module only)
│   └── app/
│       ├── main.py
│       ├── auth/                # JWT + Security
│       ├── database/            # PostgreSQL connection
│       ├── models/              # SQLAlchemy models
│       ├── repositories/        # Data layer
│       ├── routers/             # REST routes
│       ├── schemas/             # Pydantic schemas
│       └── services/            # Business logic
│
└── supabase/                    # SQL migrations
    └── migrations/
        ├── 0001_schema.sql      # Main tables + RLS + profile trigger
        ├── 0002_seed.sql        # Demo data
        └── 0003_modulos_clinicos.sql  # SOAP records, prescriptions, attachments, alerts
```

---

## 🚀 Deploy

### 1. Supabase (database + auth)
1. Create a project at [app.supabase.com](https://app.supabase.com)
2. **SQL Editor** → run `supabase/migrations/0001_schema.sql`
3. **SQL Editor** → run `supabase/migrations/0003_modulos_clinicos.sql`
4. (Optional) `0002_seed.sql` for demo data
5. In **Settings → API**, copy `Project URL` and `anon public key`

### 2. Frontend (Vercel)
1. Connect the GitHub repository on [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variables:
   - `VITE_SUPABASE_URL` → Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → anon public key
4. **Authentication → URL Configuration** on Supabase:
   - `Site URL`: Vercel deployment URL
   - `Redirect URLs`: Vercel URL with `/**`

### 3. Backend (optional — AI only)
- Host on [Render](https://render.com) or [Railway](https://railway.app)
- Set environment variables (`DATABASE_URL`, `OPENAI_API_KEY`, `SECRET_KEY`)

---

## 🧪 Local Development

```bash
# Frontend
cd frontend
npm install
cp .env.example .env   # Fill in Supabase credentials
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```


---

## 📄 License

Private project — all rights reserved.