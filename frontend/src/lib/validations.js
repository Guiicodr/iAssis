import { z } from "zod";

// ─── Login ───────────────────────────────────────────
// Apenas valida que não está vazio — a complexidade é exigida no cadastro
export const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  senha: z.string().min(1, "A senha é obrigatória"),
});

// ─── Cadastro ────────────────────────────────────────
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
    papel: z.enum(["profissional", "paciente"], {
      errorMap: () => ({ message: "Selecione seu tipo de perfil" }),
    }),
  })
  .refine((data) => data.senha === data.confirmar_senha, {
    message: "As senhas não conferem",
    path: ["confirmar_senha"],
  });

// ─── Reset de senha ──────────────────────────────────
export const resetSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
});

// ─── Strength calculator ─────────────────────────────
export function calcPasswordStrength(senha) {
  if (!senha) return { label: "", level: 0, color: "bg-muted" };
  let score = 0;
  if (senha.length >= 6) score += 1;
  if (senha.length >= 10) score += 1;
  if (/[A-Z]/.test(senha)) score += 1;
  if (/[0-9]/.test(senha)) score += 1;
  if (/[^a-zA-Z0-9]/.test(senha)) score += 1;

  if (score <= 2) return { label: "Fraca", level: 1, color: "bg-destructive" };
  if (score <= 3) return { label: "Média", level: 2, color: "bg-amber-400" };
  return { label: "Forte", level: 3, color: "bg-primary" };
}

// ─── Schemas de dados (mantidos) ─────────────────────
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
  status: z.enum(["Agendada", "Confirmada", "Em Andamento", "Concluída", "Cancelada"]).default("Agendada"),
  observacao: z.string().optional(),
});

export const prontuarioSchema = z.object({
  paciente_id: z.string().uuid("Selecione um paciente"),
  subjetivo: z.string().optional(),
  objetivo: z.string().optional(),
  avaliacao: z.string().optional(),
  plano: z.string().optional(),
});

export const prescricaoSchema = z.object({
  paciente_id: z.string().uuid("Selecione um paciente"),
  tipo: z.enum(["receita", "atestado"]).default("receita"),
  medicamento: z.string().min(3, "Medicamento obrigatório"),
  posologia: z.string().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  observacoes: z.string().optional(),
});

export const anexoSchema = z.object({
  paciente_id: z.string().uuid("Selecione um paciente"),
  tipo: z.enum(["exame", "laudo", "receita", "atestado", "outro"]),
  descricao: z.string().optional(),
});

export const alertaSchema = z.object({
  paciente_id: z.string().uuid("Selecione um paciente").optional().or(z.literal("")),
  tipo: z.enum(["exame_pendente", "reavaliacao", "retorno", "observacao"]),
  mensagem: z.string().min(5, "Mensagem deve ter no mínimo 5 caracteres"),
  prioridade: z.enum(["baixa", "normal", "alta", "urgente"]).default("normal"),
});

export const perfilSchema = z.object({
  nome_completo: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  telefone: z.string().optional(),
});