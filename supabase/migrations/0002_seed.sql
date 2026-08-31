-- Dados demo para desenvolvimento
do $$
begin
  if not exists (select 1 from public.pacientes limit 1) then
    insert into public.pacientes (id, nome, cpf, email, telefone, data_nascimento, status, created_by)
    values
      ('a0000001-0000-0000-0000-000000000001', 'Ana Silva',       '123.456.789-00', 'ana.silva@email.com',   '(11) 98765-4321', '1990-03-15', 'Ativo',   (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000002', 'Carlos Eduardo',   '987.654.321-11', 'carlos.edu@email.com',  '(11) 91234-5678', '1985-07-22', 'Ativo',   (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000003', 'Mariana Costa',    '456.789.123-22', 'mariana.c@email.com',   '(11) 97777-8888', '1992-11-02', 'Ativo',   (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000004', 'Lucas Pereira',    '321.654.987-33', 'lucas.p@email.com',     '(11) 96666-5555', '1978-05-10', 'Inativo', (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000005', 'Fernanda Oliveira','111.222.333-44', 'fernanda.o@email.com',  '(11) 95555-4444', '2000-09-28', 'Ativo',   (select id from auth.users limit 1));

    insert into public.profissionais (id, nome, especialidade, crm, email, telefone, disponibilidade, created_by)
    values
      ('b0000001-0000-0000-0000-000000000001', 'Dr. Roberto Alves',   'Cardiologia',   '123456-SP', 'roberto.alves@clinica.com',  '(11) 98888-1111', 'Seg / Qua / Sex', (select id from auth.users limit 1)),
      ('b0000001-0000-0000-0000-000000000002', 'Dra. Patricia Lima',  'Neurologia',    '654321-SP', 'patricia.lima@clinica.com',  '(11) 97777-2222', 'Ter / Qui',       (select id from auth.users limit 1)),
      ('b0000001-0000-0000-0000-000000000003', 'Dr. Fernando Souza',  'Clínica Geral', '789123-SP', 'fernando.souza@clinica.com', '(11) 96666-3333', 'Seg a Sex',       (select id from auth.users limit 1));

    insert into public.consultas (paciente_id, profissional_id, data_hora, tipo, status, observacao, created_by)
    values
      ('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', now() + interval '1 hour',  'Retorno',          'Agendada',  'Paciente estável, retorno de rotina',                                         (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000002', now() + interval '3 hours',  'Primeira Consulta', 'Agendada',  'Queixas de cefaleia persistente',                                              (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003', now() - interval '1 day',   'Avaliação',        'Concluída', 'Exames laboratoriais solicitados',                                              (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', now() + interval '1 day',   'Primeira Consulta', 'Agendada',  'Check-up geral anual',                                                           (select id from auth.users limit 1)),
      ('a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000003', now() - interval '3 days',  'Retorno',          'Concluída', 'Paciente apresentou melhora significativa. Manter medicação atual e retorno em 60 dias.', (select id from auth.users limit 1));
  end if;
end;
$$;