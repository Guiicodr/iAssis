# 🩺 iAssis — Gestão Clínica Inteligente

**iAssis** é uma plataforma full-stack para gestão clínica com autenticação por perfil (profissional/paciente), prontuário eletrônico SOAP, prescrição digital, gestão de exames e módulo de IA para triagem.

---

## ✨ Funcionalidades

### 👨‍⚕️ Módulo Profissional
- **Dashboard** com métricas em tempo real, gráficos e feed de atividades
- **CRUD completo** de Pacientes, Profissionais e Consultas
- **Prontuário Eletrônico SOAP** — registro estruturado (Subjetivo, Objetivo, Avaliação, Plano)
- **Prescrição Digital** — receitas e atestados com medicamentos, posologia e datas
- **Exames e Anexos** — laudos, exames laboratoriais e documentos por paciente
- **Módulo de IA** — análise de queixas clínicas para apoio à triagem

### 🧑‍🤝‍🧑 Portal do Paciente
- Acompanhamento de consultas agendadas e realizadas
- Histórico de evoluções (prontuário SOAP)
- Prescrições ativas

### 🔐 Autenticação
- Login e cadastro com validação em tempo real (Zod + React Hook Form)
- Seletor de perfil: Profissional ou Paciente
- Rotas protegidas e redirecionamento dinâmico pós-login
- Sessão segura via Supabase Auth

---

## 🛠️ Tech Stack

### Frontend
| Tecnologia | Versão |
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

### Backend (FastAPI — apenas para o módulo de IA)
| Tecnologia | Versão |
|---|---|
| **Python** | 3.11+ |
| **FastAPI** | 0.141+ |
| **SQLAlchemy** | 2.0+ |
| **PostgreSQL** | — |
| **JWT (python-jose)** | — |

### Infraestrutura
| Serviço | Função |
|---|---|
| **Supabase** | Autenticação, banco PostgreSQL, Row Level Security, Realtime |
| **Vercel** | Deploy do frontend |

---

## 📐 Arquitetura

```
Usuário → Vercel (React SPA) → Supabase (Auth + DB + RLS + Realtime)
                               └── FastAPI (opcional, apenas para IA via OpenAI)
```

O frontend se comunica **diretamente** com o Supabase para:
- Autenticação (login, cadastro, sessão)
- CRUD de todas as entidades (pacientes, profissionais, consultas, prontuários, prescrições, anexos)
- Realtime (atualizações ao vivo no dashboard)
- Row Level Security (cada usuário vê apenas seus dados)

O backend FastAPI fica disponível exclusivamente para o módulo de IA (análise de sintomas com OpenAI).

---

## 📁 Estrutura do Projeto

```
iassis/
├── frontend/                    # React + Vite (SPA)
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   └── ui/              # shadcn/ui (button, card, input, badge, modal, label)
│   │   ├── contexts/            # AuthContext (sessão, perfil, signUp/signIn/signOut)
│   │   ├── layouts/             # DashboardLayout (sidebar + header dark)
│   │   ├── lib/                 # Utilitários (supabaseClient, validations Zod, formatadores)
│   │   └── pages/               # Páginas da aplicação
│   │       ├── Login.jsx
│   │       ├── Cadastro.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Pacientes.jsx
│   │       ├── Profissionais.jsx
│   │       ├── Consultas.jsx
│   │       ├── ProntuarioEletronico.jsx   # SOAP
│   │       ├── PrescricaoDigital.jsx      # Receitas/Atestados
│   │       ├── Anexos.jsx                 # Exames/Laudos
│   │       ├── IA.jsx                     # Triagem
│   │       ├── Perfil.jsx
│   │       └── PortalPaciente.jsx
│   └── package.json
│
├── backend/                     # FastAPI (apenas módulo de IA)
│   └── app/
│       ├── main.py
│       ├── auth/                # JWT + segurança
│       ├── database/            # Conexão PostgreSQL
│       ├── models/              # SQLAlchemy models
│       ├── repositories/        # Camada de dados
│       ├── routers/             # Rotas REST
│       ├── schemas/             # Pydantic schemas
│       └── services/            # Lógica de negócio
│
└── supabase/                    # Migrations SQL
    └── migrations/
        ├── 0001_schema.sql      # Tabelas principais + RLS + trigger profile
        ├── 0002_seed.sql        # Dados demo
        └── 0003_modulos_clinicos.sql  # Prontuários, prescrições, anexos, alertas
```

---

## 🚀 Deploy

### 1. Supabase (banco + auth)
1. Crie um projeto em [app.supabase.com](https://app.supabase.com)
2. **SQL Editor** → execute `supabase/migrations/0001_schema.sql`
3. **SQL Editor** → execute `supabase/migrations/0003_modulos_clinicos.sql`
4. (Opcional) `0002_seed.sql` para dados demo
5. Em **Settings → API**, copie `Project URL` e `anon public key`

### 2. Frontend (Vercel)
1. Conecte o repositório GitHub na [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL` → URL do projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` → chave anônima
4. **Authentication → URL Configuration** no Supabase:
   - `Site URL`: URL da Vercel
   - `Redirect URLs`: URL da Vercel com `/**`

### 3. Backend (opcional — apenas para IA)
- Hospedar em [Render](https://render.com) ou [Railway](https://railway.app)
- Configurar variáveis de ambiente (`DATABASE_URL`, `OPENAI_API_KEY`, `SECRET_KEY`)

---

## 🧪 Desenvolvimento Local

```bash
# Frontend
cd frontend
npm install
cp .env.example .env   # Preencher com credenciais Supabase
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 📄 Licença

Projeto privado — todos os direitos reservados.
