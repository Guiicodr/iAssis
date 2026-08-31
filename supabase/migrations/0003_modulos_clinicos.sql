-- Novas tabelas para módulos clínicos avançados
-- ============================================================

-- Prontuário Eletrônico (SOAP)
create table if not exists public.prontuarios (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profissional_id uuid not null references auth.users(id),
  data timestamptz not null default now(),
  subjetivo text,
  objetivo text,
  avaliacao text,
  plano text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.prontuarios enable row level security;

-- Anexos e Exames
create table if not exists public.anexos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('exame','laudo','receita','atestado','outro')),
  descricao text,
  url text not null,
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.anexos enable row level security;

-- Prescrições Digitais
create table if not exists public.prescricoes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profissional_id uuid not null references auth.users(id),
  tipo text not null default 'receita' check (tipo in ('receita','atestado')),
  medicamento text not null,
  posologia text,
  data_inicio date,
  data_fim date,
  observacoes text,
  status text not null default 'ativa' check (status in ('ativa','encerrada','cancelada')),
  created_at timestamptz not null default now()
);
alter table public.prescricoes enable row level security;

-- Alertas Clínicos
create table if not exists public.alertas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references public.pacientes(id) on delete cascade,
  tipo text not null check (tipo in ('exame_pendente','reavaliacao','retorno','observacao')),
  mensagem text not null,
  prioridade text not null default 'normal' check (prioridade in ('baixa','normal','alta','urgente')),
  lido boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
alter table public.alertas enable row level security;

-- RLS Policies
create policy "prontuarios_all" on public.prontuarios for all using (auth.role() = 'authenticated');
create policy "anexos_all" on public.anexos for all using (auth.role() = 'authenticated');
create policy "prescricoes_all" on public.prescricoes for all using (auth.role() = 'authenticated');
create policy "alertas_select_all" on public.alertas for select using (auth.role() = 'authenticated');
create policy "alertas_insert_all" on public.alertas for insert with check (auth.role() = 'authenticated');
create policy "alertas_update_all" on public.alertas for update using (auth.role() = 'authenticated');