-- ============================================================
-- Migration 0001: Schema principal do iAssis
-- ============================================================
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text not null,
  papel text not null default 'admin' check (papel in ('admin','medico','atendente')),
  telefone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Pacientes
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text unique,
  email text,
  telefone text,
  data_nascimento date,
  status text not null default 'Ativo' check (status in ('Ativo','Inativo')),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.pacientes enable row level security;

-- Profissionais
create table if not exists public.profissionais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  especialidade text not null,
  crm text,
  email text,
  telefone text,
  disponibilidade text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profissionais enable row level security;

-- Consultas
create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete restrict,
  profissional_id uuid not null references public.profissionais(id) on delete restrict,
  data_hora timestamptz not null,
  tipo text not null default 'Primeira Consulta' check (tipo in ('Primeira Consulta','Retorno','Avaliação','Exame')),
  status text not null default 'Agendada' check (status in ('Agendada','Confirmada','Em Andamento','Concluída','Cancelada')),
  observacao text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.consultas enable row level security;
-- Logs de atividade
create table if not exists public.atividade_logs (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id),
  acao text not null,
  entidade text not null,
  entidade_id uuid,
  detalhes jsonb,
  created_at timestamptz not null default now()
);
alter table public.atividade_logs enable row level security;

-- RLS Policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "pacientes_all" on public.pacientes for all using (auth.role() = 'authenticated');
create policy "profissionais_all" on public.profissionais for all using (auth.role() = 'authenticated');
create policy "consultas_all" on public.consultas for all using (auth.role() = 'authenticated');
create policy "atividade_logs_insert" on public.atividade_logs for insert with check (auth.uid() = usuario_id);
create policy "atividade_logs_select" on public.atividade_logs for select using (auth.uid() = usuario_id);

-- Trigger: criar profile no signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nome_completo, papel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome_completo', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'papel', 'admin')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- View métricas
create or replace view public.metricas_dashboard with (security_invoker = true) as
select
  (select count(*) from public.pacientes where status = 'Ativo')                                        as pacientes_ativos,
  (select count(*) from public.consultas where date_trunc('day', data_hora) = date_trunc('day', now())) as consultas_hoje,
  (select count(*) from public.profissionais)                                                            as total_profissionais,
  (select count(*) from public.consultas
    where data_hora >= date_trunc('week', now())
      and data_hora <  date_trunc('week', now()) + interval '7 days')                                   as agendamentos_semana,
  (select
    case when count(*) > 0
      then round(
        (count(*) filter (where status = 'Concluída')::numeric / nullif(count(*), 0)) * 100, 1
      )
      else 0
    end
    from public.consultas
    where data_hora >= now() - interval '30 days')                                                      as taxa_presenca_30d;