import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cadastroSchema } from "@/lib/validations";

export default function Cadastro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { papel: "profissional" },
  });
  const papel = watch("papel");

  async function onSubmit(data) {
    const promise = signUp({ email: data.email, senha: data.senha, nome_completo: data.nome_completo, papel: data.papel });
    toast.promise(promise, { loading: "Criando conta...", success: "Conta criada com sucesso!", error: (err) => err.message });
    try { await promise; navigate(papel === "paciente" ? "/portal" : "/dashboard"); } catch { /* prevented by toast */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-emerald-600 text-white text-2xl font-bold mb-3">IA</div>
          <h1 className="text-2xl font-bold text-zinc-100">iAssis</h1>
          <p className="text-sm text-zinc-400 mt-1">Crie sua conta gratuita</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
          <div className="text-center"><h2 className="text-lg font-semibold text-zinc-100">Cadastro</h2></div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nome completo</label>
            <input type="text" {...register("nome_completo")} placeholder="Seu nome" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
            {errors.nome_completo && <p className="text-xs text-red-400 mt-1">{errors.nome_completo.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo de perfil</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${!papel || papel === "profissional" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"}`}>
                <input type="radio" value="profissional" {...register("papel")} className="sr-only" />
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14.25V6.75L12 3.75 7.5 6.75v7.5m9 0h-9m9 0l3 3m-3-3l-3 3" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75a9 9 0 100-18 9 9 0 000 18z" /></svg>
                <span className="text-sm font-medium">Profissional</span>
              </label>
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${papel === "paciente" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"}`}>
                <input type="radio" value="paciente" {...register("papel")} className="sr-only" />
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                <span className="text-sm font-medium">Paciente</span>
              </label>
            </div>
            {errors.papel && <p className="text-xs text-red-400 mt-1">{errors.papel.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
            <input type="email" {...register("email")} placeholder="seu@email.com" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
            <input type="password" {...register("senha")} placeholder="Mín. 6, 1 maiúscula, 1 número" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
            {errors.senha && <p className="text-xs text-red-400 mt-1">{errors.senha.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Confirmar senha</label>
            <input type="password" {...register("confirmar_senha")} placeholder="Repita a senha" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500" />
            {errors.confirmar_senha && <p className="text-xs text-red-400 mt-1">{errors.confirmar_senha.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50">{isSubmitting ? "Criando..." : "Criar conta"}</button>
          <p className="text-center text-sm text-zinc-500">Já tem conta? <Link to="/login" className="text-emerald-400 font-medium hover:text-emerald-300">Faça login</Link></p>
        </form>
      </div>
    </div>
  );
}
