# iAssis â€” Supabase

## Setup
1. Create a project on the [Supabase Dashboard](https://app.supabase.com)
2. Run `migrations/0001_schema.sql` in the SQL Editor (tables, RLS, trigger)
3. Run `migrations/0003_modulos_clinicos.sql` in the SQL Editor (SOAP records, prescriptions, attachments, alerts)
4. (Optional) Run `migrations/0002_seed.sql` for demo data (after creating a user)
5. Add the keys (`Project URL` + `anon key`) to the frontend's `.env`

## Storage
Create a bucket called `avatars` (public) in Supabase Storage for profile picture uploads.

## Realtime
Enable **Replication** on the `consultas` table in Database â†’ Replication for live dashboard updates.