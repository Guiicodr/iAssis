import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cadastroSchema } from "@/lib/validations";

export default function Cadastro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
  });

  async function onSubmit(data) {
    const promise = signUp({
      email: data.email,
      senha: data.senha,
      nome_completo: data.nome_completo,
    });
    toast.promise(promise, {
      loading: "Criando conta...",
      success: "Conta criada com sucesso!",
      error: (err) => err.message,
    });
    try {
      await promise;
      navigate("/dashboard");
    } catch {
      // handled by toast
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-[#8ba888] text-white text-2xl font-bold mb-3 shadow-sm">
            IA
          </div>
          <h1 className="text-2xl font-bold text-[#1f2937]">iAssis</h1>
          <p className="text-sm text-[#6b7280] mt-1">Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#1f2937]">Cadastro</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Nome completo</label>
            <input
              type="text"
              {...register("nome_completo")}
              placeholder="Seu nome"
              className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
            />
            {errors.nome_completo && (
              <p className="text-xs text-[#dc2626] mt-1">{errors.nome_completo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">E-mail</label>
            <input
              type="email"
              {...register("email")}
              placeholder="seu@email.com"
              className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
            />
            {errors.email && (
              <p className="text-xs text-[#dc2626] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Senha</label>
            <input
              type="password"
              {...register("senha")}
              placeholder="Mín. 6 caracteres, 1 maiúscula, 1 número"
              className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
            />
            {errors.senha && (
              <p className="text-xs text-[#dc2626] mt-1">{errors.senha.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Confirmar senha</label>
            <input
              type="password"
              {...register("confirmar_senha")}
              placeholder="Repita a senha"
              className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
            />
            {errors.confirmar_senha && (
              <p className="text-xs text-[#dc2626] mt-1">{errors.confirmar_senha.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-[#8ba888] hover:bg-[#7a9a78] text-white font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Criando..." : "Criar conta"}
          </button>

          <p className="text-center text-sm text-[#6b7280]">
            Já tem conta?{" "}
            <Link to="/login" className="text-[#8ba888] font-medium hover:text-[#7a9a78]">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}