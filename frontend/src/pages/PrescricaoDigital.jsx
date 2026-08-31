import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { prescricaoSchema } from "@/lib/validations";
import { formatarDataISO } from "@/lib/formatacao";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function PrescricaoDigital() {
  const [prescricoes, setPrescricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(prescricaoSchema),
  });

  useEffect(() => {
    supabase
      .from("prescricoes")
      .select("*, paciente:pacientes(nome)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPrescricoes(data);
        setLoading(false);
      });
  }, []);

  function abrirModal(item) {
    setEditando(item);
    if (item) {
      reset({
        paciente_id: item.paciente_id,
        tipo: item.tipo,
        medicamento: item.medicamento,
        posologia: item.posologia || "",
        data_inicio: item.data_inicio || "",
        data_fim: item.data_fim || "",
        observacoes: item.observacoes || "",
      });
    } else {
      reset({ paciente_id: "", tipo: "receita", medicamento: "", posologia: "", data_inicio: "", data_fim: "", observacoes: "" });
    }
    setModalOpen(true);
  }

  async function onSubmit(data) {
    const promise = (async () => {
      if (editando) {
        await supabase.from("prescricoes").update(data).eq("id", editando.id);
      } else {
        await supabase.from("prescricoes").insert(data);
      }
      setModalOpen(false);
      setEditando(null);
      const { data: d } = await supabase.from("prescricoes").select("*, paciente:pacientes(nome)").order("created_at", { ascending: false });
      if (d) setPrescricoes(d);
    })();
    toast.promise(promise, { loading: editando ? "Atualizando..." : "Salvando...", success: "Feito!", error: (err) => err.message });
    try { await promise; } catch { /* prevented by toast */ }
  }

  const columns = [
    { key: "medicamento", label: "Medicamento", sortable: true },
    { key: "paciente", label: "Paciente", render: (r) => r.paciente?.nome || "—" },
    { key: "tipo", label: "Tipo", render: (r) => <Badge variant={r.tipo === "receita" ? "success" : "warning"}>{r.tipo === "receita" ? "Receita" : "Atestado"}</Badge> },
    { key: "posologia", label: "Posologia" },
    { key: "data_inicio", label: "Inicio", render: (r) => formatarDataISO(r.data_inicio) },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "ativa" ? "success" : "default"}>{r.status}</Badge> },
  ];

  if (loading) return <div className="space-y-4"><div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" /><div className="h-96 bg-zinc-900 rounded-xl border border-zinc-800 animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Prescricao Digital</h1>
        <p className="text-sm text-zinc-400 mt-1">Criacao e gerenciamento de receitas e atestados medicos</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => abrirModal()} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">+ Nova Prescricao</button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {columns.map((col) => (
                    <th key={col.key} className="px-5 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {prescricoes.length === 0 ? (
                  <tr><td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-zinc-500">Nenhuma prescricao cadastrada.</td></tr>
                ) : prescricoes.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/50 transition-colors">
                    {columns.map((col) => (<td key={col.key} className="px-5 py-3.5 text-zinc-300">{col.render ? col.render(r) : r[col.key] ?? "—"}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditando(null); }} title={editando ? "Editar Prescricao" : "Nova Prescricao"}>
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
                <option value="receita">Receita</option>
                <option value="atestado">Atestado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Medicamento *</label>
              <input {...register("medicamento")} placeholder="Nome do medicamento" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
              {errors.medicamento && <p className="text-xs text-red-400 mt-1">{errors.medicamento.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Posologia</label>
            <input {...register("posologia")} placeholder="Ex: 1 comprimido 8/8h por 7 dias" className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Data inicio</label>
              <input type="date" {...register("data_inicio")} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Data fim</label>
              <input type="date" {...register("data_fim")} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Observacoes</label>
            <textarea {...register("observacoes")} rows={3} className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }} className="px-4 py-2 border border-zinc-700 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50">{isSubmitting ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
