import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { resetSchema } from "@/lib/validations";
import AmbientBackground from "@/components/AmbientBackground";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function RecuperarSenha() {
  const { resetPassword } = useAuth();
  const [enviado, setEnviado] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data) {
    const promise = resetPassword({ email: data.email });
    toast.promise(promise, {
      loading: "Enviando link...",
      success: "Link de recuperação enviado! Verifique seu e-mail.",
      error: (err) => err.message,
    });
    try { await promise; setEnviado(true); } catch { /* prevented by toast */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <AmbientBackground />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary text-2xl font-serif font-bold mb-3 shadow-sm">iA</div>
          <h1 className="text-2xl font-bold text-foreground">iAssis</h1>
          <p className="text-sm text-muted-foreground mt-1">Recuperar acesso</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 animate-slide-up shadow-sm">
          {enviado ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
                <CheckCircle size={28} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">E-mail enviado!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
              >
                <ArrowLeft size={16} />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-5">
                <h2 className="text-lg font-semibold text-foreground">Redefinir senha</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Digite seu e-mail e enviaremos um link para criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="seu@email.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 disabled:opacity-50 active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  {isSubmitting ? "Enviando..." : "Enviar link"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft size={16} />
                  Voltar para o login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
