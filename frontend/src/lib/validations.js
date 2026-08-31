import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const cadastroSchema = z
  .object({
    nome_completo: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Insira um e-mail válido"),
    senha: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter ao menos um número"),
    confirmar_senha: z.string(),
  })
  .refine((data) => data.senha === data.confirmar_senha, {
    message: "As senhas não conferem",
    path: ["confirmar_senha"],
  });

export const pacienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
});

export const profissionalSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  especialidade: z.string().min(3, "Especialidade obrigatória"),
  crm: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional(),
  disponibilidade: z.string().optional(),
});

export const consultaSchema = z.object({
  paciente_id: z.string().uuid("Selecione um paciente"),
  profissional_id: z.string().uuid("Selecione um profissional"),
  data_hora: z.string().min(1, "Data e hora obrigatórias"),
  tipo: z.enum(["Primeira Consulta", "Retorno", "Avaliação", "Exame"]),
  status: z
    .enum(["Agendada", "Confirmada", "Em Andamento", "Concluída", "Cancelada"])
    .default("Agendada"),
  observacao: z.string().optional(),
});

export const perfilSchema = z.object({
  nome_completo: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  telefone: z.string().optional(),
});