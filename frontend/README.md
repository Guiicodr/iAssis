# iAssis — Frontend

Aplicação React para gestão clínica inteligente com Supabase.

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento (Vite)
npm run build     # Build de produção
npm run lint      # ESLint
npm run preview   # Preview do build de produção
```

## Dependências principais

- **React 19** + **Vite 8**
- **Tailwind CSS 4** + **shadcn/ui** (base-ui)
- **React Router 7** — navegação SPA
- **React Hook Form 7** + **Zod 4** — formulários com validação
- **Supabase JS** — auth, banco, realtime, storage
- **Recharts** — gráficos do dashboard
- **Sonner** — toasts
- **Lucide React** — ícones

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis (DataTable, ProtectedRoute, ui/)
├── contexts/       # AuthContext (sessão, perfil, signUp/signIn/signOut)
├── layouts/        # DashboardLayout (sidebar + header)
├── lib/            # Utilitários (supabaseClient, validations, formatacao)
└── pages/          # Páginas (Login, Cadastro, Dashboard, CRUD, módulos clínicos)
```
