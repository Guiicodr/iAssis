import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/lib/validations";

export default function Login() {
  const { signIn } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
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
    <div className={"min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden bg-glow"}>
      <div className={"absolute top-20 left-10 size-24 rounded-full bg-emerald-500/5 blur-3xl animate-float"} />
      <div className={"absolute bottom-20 right-10 size-32 rounded-full bg-emerald-500/5 blur-3xl animate-float-delayed"} />
      <div className={"absolute top-1/3 right-1/4 size-16 rounded-full bg-blue-500/5 blur-3xl animate-float"} style={{ animationDelay: "0.8s" }} />
      
      <div className={"w-full max-w-sm relative z-10"}>
        <div className={"text-center mb-8 animate-fade-in-up"}>
          <div className={"inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-2xl font-bold mb-3 shadow-lg animate-glow"}>IA</div>
          <h1 className={"text-2xl font-bold text-zinc-100"}>iAssis</h1>
          <p className={"text-sm text-zinc-400 mt-1"}>Gestao inteligente da sua clinica</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={"bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 p-6 space-y-5 animate-slide-up"}>
          <div className={"text-center"}><h2 className={"text-lg font-semibold text-zinc-100"}>Acessar conta</h2></div>
          <div>
            <label className={"block text-sm font-medium text-zinc-300 mb-1"}>E-mail</label>
            <input type={"email"} {...register("email")} placeholder={"seu@email.com"} className={"w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"} />
            {errors.email && <p className={"text-xs text-red-400 mt-1"}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={"block text-sm font-medium text-zinc-300 mb-1"}>Senha</label>
            <input type={"password"} {...register("senha")} placeholder={"••••••••"} className={"w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"} />
            {errors.senha && <p className={"text-xs text-red-400 mt-1"}>{errors.senha.message}</p>}
          </div>
          <button type={"submit"} disabled={isSubmitting} className={"w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium transition-all duration-300 disabled:opacity-50 active:scale-[0.98] hover:shadow-lg hover:shadow-emerald-500/20"}>{isSubmitting ? "Entrando..." : "Entrar"}</button>
          <p className={"text-center text-sm text-zinc-500"}>Nao tem conta? <Link to={"/cadastro"} className={"text-emerald-400 font-medium hover:text-emerald-300 transition-colors"}>Cadastre-se</Link></p>
        </form>
      </div>
    </div>
  );
}
