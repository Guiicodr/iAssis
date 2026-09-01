# iAssis — Frontend

React application for intelligent clinical management with Supabase.

## Scripts

```bash
npm run dev       # Development server (Vite)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Main dependencies

- **React 19** + **Vite 8**
- **Tailwind CSS 4** + **shadcn/ui** (base-ui)
- **React Router 7** — SPA navigation
- **React Hook Form 7** + **Zod 4** — forms with validation
- **Supabase JS** — auth, database, realtime, storage
- **Recharts** — dashboard charts
- **Sonner** — toasts
- **Lucide React** — icons

## Environment variables

Create a file `.env` at the frontend root:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Structure

```
src/
├── components/     # Reusable components (DataTable, ProtectedRoute, ui/)
├── contexts/       # AuthContext (sessão, perfil, signUp/signIn/signOut)
├── layouts/        # DashboardLayout (sidebar + header)
├── lib/            # Utilities (supabaseClient, validations, formatacao)
└── pages/          # Pages (Login, Cadastro, Dashboard, CRUD, módulos clínicos)
```
