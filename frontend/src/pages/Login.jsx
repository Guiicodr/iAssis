import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/lib/validations";

export default function Login() {
  const { signIn } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-emerald-600 text-white text-2xl font-bold mb-3">IA</div>
          <h1 className="text-2xl font-bold text-zinc-100">iAssis</h1>
          <p className="text-sm text-zinc-400 mt-1">Gestão inteligente da sua clínica</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-5">
          <div className="text-center"><h2 className="text-lg font-semibold text-zinc-100">Acessar conta</h2></div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
            <input type="email" {...register("email")} placeholder="seu@email.com" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
            <input type="password" {...register("senha")} placeholder="••••••••" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
            {errors.senha && <p className="text-xs text-red-400 mt-1">{errors.senha.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50">{isSubmitting ? "Entrando..." : "Entrar"}</button>
          <p className="text-center text-sm text-zinc-500">Não tem conta? <Link to="/cadastro" className="text-emerald-400 font-medium hover:text-emerald-300">Cadastre-se</Link></p>
        </form>
      </div>
    </div>
  );
}