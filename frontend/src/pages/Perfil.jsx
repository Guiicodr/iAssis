import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { perfilSchema } from "@/lib/validations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export default function Perfil() {
  const { profile, user, updateProfile, signOut } = useAuth();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nome_completo: profile?.nome_completo || "",
      telefone: profile?.telefone || "",
    },
  });

  async function onSubmit(data) {
    const promise = updateProfile(data);
    toast.promise(promise, {
      loading: "Salvando...",
      success: "Perfil atualizado!",
      error: (err) => err.message,
    });
    try {
      await promise;
    } catch {
      // handled
    }
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: urlData.publicUrl });
      toast.success("Avatar atualizado!");
    } catch (err) {
      toast.error(err.message || "Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">Meu Perfil</h1>
        <p className="text-sm text-[#6b7280] mt-1">Gerencie suas informações pessoais</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-[#1f2937]">Informações da conta</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-[#8ba888] flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                (profile?.nome_completo || "U").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <label className="cursor-pointer text-sm font-medium text-[#8ba888] hover:text-[#7a9a78]">
                {uploading ? "Enviando..." : "Alterar foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-[#9ca3af] mt-0.5">PNG ou JPG (máx. 2MB)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Nome completo</label>
              <input
                type="text"
                {...register("nome_completo")}
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
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-[#f9fafb] text-sm text-[#9ca3af] cursor-not-allowed"
              />
              <p className="text-xs text-[#9ca3af] mt-1">O e-mail não pode ser alterado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Telefone</label>
              <input
                type="text"
                {...register("telefone")}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#8ba888] hover:bg-[#7a9a78] text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-[#1f2937]">Sessão</h2>
        </CardHeader>
        <CardContent>
          <button
            onClick={signOut}
            className="px-5 py-2 rounded-lg border border-[#dc2626] text-[#dc2626] text-sm font-medium hover:bg-[#fce4ec] transition-colors"
          >
            Sair da conta
          </button>
        </CardContent>
      </Card>
    </div>
  );
}