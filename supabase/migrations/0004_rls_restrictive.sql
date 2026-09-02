-- ============================================================
-- Migration 0004: RLS restritiva por papel (segurança)
-- ============================================================
-- Remove as policies genéricas de "authenticated" e cria
-- policies granulares baseadas no papel do usuário (profiles.papel)
-- ============================================================

-- 1. Revoga policies antigas (permissivas)
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "pacientes_all" on public.pacientes;
drop policy if exists "profissionais_all" on public.profissionais;
drop policy if exists "consultas_all" on public.consultas;
drop policy if exists "prontuarios_all" on public.prontuarios;
drop policy if exists "anexos_all" on public.anexos;
drop policy if exists "prescricoes_all" on public.prescricoes;
drop policy if exists "alertas_select_all" on public.alertas;
drop policy if exists "alertas_insert_all" on public.alertas;
drop policy if exists "alertas_update_all" on public.alertas;

-- 2. Profiles: admin pode ver todos; cada um vê o próprio
create policy "profiles_select"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and papel = 'admin'
    )
  );

create policy "profiles_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    -- Usuário não pode alterar o próprio papel
    (select papel from public.profiles where id = auth.uid()) = papel
  );
-- 3. Pacientes: admin/papel profissional pode tudo; paciente só vê o próprio
create policy "pacientes_select"
  on public.pacientes for select
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "pacientes_insert"
  on public.pacientes for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "pacientes_update"
  on public.pacientes for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "pacientes_delete"
  on public.pacientes for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel = 'admin'
    )
  );

-- 4. Consultas: admin/medico/atendente vê todas; paciente vê só as suas
create policy "consultas_select"
  on public.consultas for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "consultas_insert"
  on public.consultas for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "consultas_update"
  on public.consultas for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "consultas_delete"
  on public.consultas for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel = 'admin'
    )
  );
-- 5. Profissionais: só admin/medico pode gerenciar
create policy "profissionais_select"
  on public.profissionais for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "profissionais_insert"
  on public.profissionais for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

create policy "profissionais_update"
  on public.profissionais for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

create policy "profissionais_delete"
  on public.profissionais for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel = 'admin'
    )
  );

-- 6. Prontuários: profissional/admin vê todos; paciente vê só os seus
create policy "prontuarios_select"
  on public.prontuarios for select
  using (
    paciente_id in (
      select id from public.pacientes where created_by = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "prontuarios_insert"
  on public.prontuarios for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

create policy "prontuarios_update"
  on public.prontuarios for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

-- 7. Anexos: similar a prontuários
create policy "anexos_select"
  on public.anexos for select
  using (
    paciente_id in (
      select id from public.pacientes where created_by = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "anexos_insert"
  on public.anexos for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

-- 8. Prescrições
create policy "prescricoes_select"
  on public.prescricoes for select
  using (
    paciente_id in (
      select id from public.pacientes where created_by = auth.uid()
    )
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "prescricoes_insert"
  on public.prescricoes for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

create policy "prescricoes_update"
  on public.prescricoes for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico')
    )
  );

-- 9. Alertas: profissionais podem ver/criar todos; paciente vê os próprios
create policy "alertas_select"
  on public.alertas for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
    or paciente_id in (
      select id from public.pacientes where created_by = auth.uid()
    )
  );

create policy "alertas_insert"
  on public.alertas for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );

create policy "alertas_update"
  on public.alertas for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and papel in ('admin', 'medico', 'atendente')
    )
  );