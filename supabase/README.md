# iAssis — Supabase

## Setup
1. Crie um projeto no [Supabase Dashboard](https://app.supabase.com)
2. Execute `migrations/0001_schema.sql` no SQL Editor (tabelas, RLS, trigger)
3. Execute `migrations/0003_modulos_clinicos.sql` no SQL Editor (prontuários, prescrições, anexos, alertas)
4. (Opcional) Execute `migrations/0002_seed.sql` para dados demo (após criar um usuário)
5. Cole as chaves (`Project URL` + `anon key`) no `.env` do frontend

## Storage
Crie um bucket chamado `avatars` (público) no Supabase Storage para upload de fotos de perfil.

## Realtime
Habilite **Replication** na tabela `consultas` em Database → Replication para atualizações ao vivo no dashboard.