import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { anexoSchema } from "@/lib/validations";
import { formatarDataHora } from "@/lib/formatacao";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function Anexos() {
  const [anexos, setAnexos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(anexoSchema),
  });

  useEffect(() => {
    supabase.from("anexos").select("*, paciente:pacientes(nome)").order("created_at", { ascending: false }).then(({ data }) => { if (data) setAnexos(data); setLoading(false); });
  }, []);

  async function onSubmit(data) {
    setUploading(true);
    try {
      const { error } = await supabase.from("anexos").insert({ paciente_id: data.paciente_id, tipo: data.tipo, descricao: data.descricao, nome: data.descricao || "Sem descrição", url: "#" });
      if (error) throw error;
      toast.success("Anexo registrado!");
      setModalOpen(false);
      reset({ paciente_id: "", tipo: "exame", descricao: "" });
      const { data: d } = await supabase.from("anexos").select("*, paciente:pacientes(nome)").order("created_at", { ascending: false });
      if (d) setAnexos(d);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  const tipoIcon = { exame: "🩸", laudo: "📄", receita: "💊", atestado: "📋", outro: "📁" };

  if (loading) return <div className="space-y-4"><div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" /><div className="h-96 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Exames e Anexos</h1>
        <p className="text-sm text-zinc-400 mt-1">Laudos, exames laboratoriais e receitas dos pacientes</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setModalOpen(true)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">+ Novo Anexo</button>
      </div>

      {anexos.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><p className="text-sm text-zinc-500">Nenhum anexo cadastrado.</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {anexos.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{tipoIcon[a.tipo] || "📁"}</span>
                  <Badge variant={a.tipo === "exame" ? "info" : a.tipo === "laudo" ? "warning" : "success"}>{a.tipo}</Badge>
                </div>
                <p className="text-sm font-medium text-zinc-200">{a.nome}</p>
                {a.descricao && <p className="text-xs text-zinc-400">{a.descricao}</p>}
                <p className="text-xs text-zinc-500">{a.paciente?.nome} — {formatarDataHora(a.created_at)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); reset({ paciente_id: "", tipo: "exame", descricao: "" }); }} title="Novo Anexo">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">ID do Paciente *</label>
            <input {...register("paciente_id")} placeholder="UUID do paciente" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
            {errors.paciente_id && <p className="text-xs text-red-400 mt-1">{errors.paciente_id.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Tipo</label>
              <select {...register("tipo")} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
                <option value="exame">Exame</option>
                <option value="laudo">Laudo</option>
                <option value="receita">Receita</option>
                <option value="atestado">Atestado</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
              <input {...register("descricao")} placeholder="Breve descrição" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); reset({ paciente_id: "", tipo: "exame", descricao: "" }); }} className="px-4 py-2 border border-zinc-700 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800">Cancelar</button>
            <button type="submit" disabled={uploading} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50">{uploading ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}