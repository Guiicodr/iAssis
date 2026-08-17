# 🩺 iAssis — Clinical Scheduling & Intelligent Triage System

**iAssis** is a full-stack platform designed to streamline clinical appointment management and enhance patient onboarding. It features an **AI-driven triage engine** that processes clinical narratives, providing automated triage assessments and specialty referral suggestions based on patient history.

---

## ✨ Key Features

- **AI-Powered Triage**: Natural language analysis of clinical descriptions to support decision-making and route patients to the correct specialty.
- **Appointment Management**: Complete control over scheduling, time slots, and consultation statuses.
- **Patient Records**: Centralized view of medical histories and previous consultations.
- **User & Staff Management**: Clean modals and forms for managing medical staff and patient registries.
- **Modern Dashboard**: Responsive, clean UI built for speed and ease of use in clinical environments.

---

## 🛠️ Tech Stack

### **Backend**
- **Language**: Python 3.11+
- **Framework**: FastAPI (High performance & automatic OpenAPI/Swagger docs)
- **Database**: PostgreSQL
- **ORM / Data Access**: SQLAlchemy / SQLModel
- **AI Module**: NLP / LLM integration for automated triage processing

### **Frontend**
- **Library**: React.js
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API Client**: Axios / Fetch API

---

## 📐 Architecture & Project Structure

The backend follows a layered, modular architecture to enforce clean code practices, scalability, and testability:

```text
iassis/
├── backend/
│   ├── app/
│   │   ├── controllers/   # REST API route handlers
│   │   ├── services/      # Business logic & AI processing engine
│   │   ├── repositories/  # Database access layer (PostgreSQL queries)
│   │   ├── models/        # Database schemas and entities
│   │   └── main.py        # FastAPI entry point
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI elements (Modals, Tables, Forms)
    │   ├── pages/         # Core application views (Dashboard, Triage, Appointments)
    │   ├── services/      # API communication modules
    │   └── App.jsx
    └── package.json
