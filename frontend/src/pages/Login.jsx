import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/lib/validations";
import AmbientBackground from "@/components/AmbientBackground";
import { Eye, EyeOff, Bug } from "lucide-react";

const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
const DEV_EMAIL = import.meta.env.VITE_TEST_EMAIL || "";
const DEV_PASSWORD = import.meta.env.VITE_TEST_PASSWORD || "";

export default function Login() {
  const { signIn } = useAuth();
  const [showSenha, setShowSenha] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  async function onSubmit(data) {
    const promise = signIn({ email: data.email, senha: data.senha });
    toast.promise(promise, {
      loading: "Entrando...",
      success: "Login realizado!",
      error: (err) => err.message,
    });
    try { await promise; } catch { /* prevented by toast */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <AmbientBackground />

      {/* Dev mode badge — invisível em produção */}
      {DEV_MODE && DEV_EMAIL && (
        <button
          type="button"
          onClick={() => {
            setValue("email", DEV_EMAIL, { shouldValidate: true });
            setValue("senha", DEV_PASSWORD, { shouldValidate: true });
          }}
          className="fixed bottom-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-card/80 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
          title="Preencher credenciais de desenvolvimento"
        >
          <Bug size={12} />
          Dev
        </button>
      )}

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary text-2xl font-serif font-bold mb-3 shadow-sm">iA</div>
          <h1 className="text-2xl font-bold text-foreground">iAssis</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão inteligente da sua clínica</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-5 animate-slide-up shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Acessar conta</h2>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
            <input
              type="email"
              {...register("email")}
              placeholder="seu@email.com"
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showSenha ? "text" : "password"}
                {...register("senha")}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.senha && <p className="text-xs text-destructive mt-1">{errors.senha.message}</p>}

            {/* Esqueceu a senha */}
            <div className="mt-2 text-right">
              <Link to="/recuperar-senha" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          {/* Cadastro */}
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-primary font-medium hover:text-primary/80 transition-colors">Cadastre-se</Link>
          </p>
        </form>

        {/* Política de Acesso */}
        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          Ao fazer login, você concorda com nossa{" "}
          <Link to="/politica-acesso" className="underline hover:text-primary transition-colors">Política de Acesso</Link>{" "}
          e{" "}
          <Link to="/politica-acesso" className="underline hover:text-primary transition-colors">Termos de Uso</Link>.
        </p>
      </div>
    </div>
  );
}
