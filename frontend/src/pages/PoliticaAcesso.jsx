import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AmbientBackground from "@/components/AmbientBackground";

export default function PoliticaAcesso() {
  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      <AmbientBackground />
      <div className="max-w-2xl mx-auto relative z-10 py-8 animate-fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
          <h1 className="text-2xl font-bold text-foreground font-serif">Política de Acesso e Termos de Uso</h1>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">1. Objetivo</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O iAssis é uma plataforma de gestão clínica destinada exclusivamente a profissionais da saúde
              e pacientes que desejam gerenciar consultas, prontuários, prescrições e demais atividades
              relacionadas ao cuidado com a saúde.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">2. Privacidade e Proteção de Dados</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todos os dados inseridos no iAssis são tratados como informações sensíveis de saúde.
              A plataforma utiliza criptografia em trânsito (TLS) e armazenamento seguro via Supabase,
              com políticas de segurança Row Level Security (RLS) para garantir que cada usuário
              acesse apenas os dados pertinentes ao seu perfil e papel.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Os dados não são compartilhados com terceiros sem consentimento explícito. O módulo
              de Inteligência Artificial (OpenAI) recebe dados anonimizados para geração de resumos
              clínicos, sem identificadores pessoais.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">3. Responsabilidades do Usuário</h2>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li>Manter sua senha em sigilo e não compartilhá-la com terceiros.</li>
              <li>Utilizar senhas fortes (mín. 6 caracteres, com maiúsculas e números).</li>
              <li>Não inserir dados falsos ou de terceiros sem autorização.</li>
              <li>Comunicar imediatamente qualquer acesso não autorizado à equipe de suporte.</li>
              <li>Respeitar a legislação vigente, incluindo a LGPD (Lei Geral de Proteção de Dados).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">4. Senhas e Autenticação</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para proteger sua conta, o iAssis exige senhas com ao menos 6 caracteres, contendo
              pelo menos uma letra maiúscula e um número. O sistema disponibiliza recuperação
              de senha via e-mail para casos de perda ou esquecimento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">5. Uso Aceitável</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O iAssis destina-se ao uso clínico legítimo. É proibido o uso da plataforma para
              fins ilegais, fraudulentos ou que violem a privacidade de terceiros. A administração
              reserva-se o direito de suspender contas que violem estes termos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">6. Contato</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dúvidas sobre esta política podem ser encaminhadas para a administração da plataforma
              através dos canais de suporte disponíveis no sistema.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
