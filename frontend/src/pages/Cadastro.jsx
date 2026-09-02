import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cadastroSchema, calcPasswordStrength } from "@/lib/validations";
import AmbientBackground from "@/components/AmbientBackground";
import { Eye, EyeOff, Stethoscope, User } from "lucide-react";

export default function Cadastro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { papel: "profissional" },
  });

  const papel = watch("papel");
  const senha = watch("senha", "");
  const strength = calcPasswordStrength(senha);

  async function onSubmit(data) {
    const promise = signUp({ email: data.email, senha: data.senha, nome_completo: data.nome_completo, papel: data.papel });
    toast.promise(promise, {
      loading: "Criando conta...",
      success: "Conta criada com sucesso!",
      error: (err) => err.message,
    });
    try { await promise; navigate(papel === "paciente" ? "/portal" : "/dashboard"); } catch { /* prevented by toast */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <AmbientBackground />
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary text-2xl font-serif font-bold mb-3 shadow-sm">iA</div>
          <h1 className="text-2xl font-bold text-foreground">iAssis</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 space-y-4 animate-slide-up shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Cadastro</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo</label>
            <input type="text" {...register("nome_completo")} placeholder="Seu nome" className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200" />
            {errors.nome_completo && <p className="text-xs text-destructive mt-1">{errors.nome_completo.message}</p>}
          </div>

          {/* Perfil */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tipo de perfil</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${!papel || papel === "profissional" ? "border-primary bg-primary/5 text-primary" : "border-border bg-muted/50 text-muted-foreground hover:border-muted-foreground/30"}`}>
                <input type="radio" value="profissional" {...register("papel")} className="sr-only" />
                <Stethoscope size={18} />
                <span className="text-sm font-medium">Profissional</span>
              </label>
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${papel === "paciente" ? "border-primary bg-primary/5 text-primary" : "border-border bg-muted/50 text-muted-foreground hover:border-muted-foreground/30"}`}>
                <input type="radio" value="paciente" {...register("papel")} className="sr-only" />
                <User size={18} />
                <span className="text-sm font-medium">Paciente</span>
              </label>
            </div>
            {errors.papel && <p className="text-xs text-destructive mt-1">{errors.papel.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
            <input type="email" {...register("email")} placeholder="seu@email.com" className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
            <div className="relative">
              <input type={showSenha ? "text" : "password"} {...register("senha")} placeholder="Mín. 6, 1 maiúscula, 1 número" className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200" />
              <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.senha && <p className="text-xs text-destructive mt-1">{errors.senha.message}</p>}
            {senha && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((lvl) => (
                    <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${lvl <= strength.level ? strength.color : "bg-muted"}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength.level === 1 ? "text-destructive" : strength.level === 2 ? "text-amber-500" : "text-primary"}`}>{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar senha</label>
            <input type="password" {...register("confirmar_senha")} placeholder="Repita a senha" className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200" />
            {errors.confirmar_senha && <p className="text-xs text-destructive mt-1">{errors.confirmar_senha.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-sm hover:shadow-md">
            {isSubmitting ? "Criando..." : "Criar conta"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">Faça login</Link>
          </p>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          Ao se cadastrar, você concorda com nossa <Link to="/politica-acesso" className="underline hover:text-primary transition-colors">Política de Acesso</Link> e <Link to="/politica-acesso" className="underline hover:text-primary transition-colors">Termos de Uso</Link>.
        </p>
      </div>
    </div>
  );
}
