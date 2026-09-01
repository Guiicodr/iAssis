import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { consultaSchema } from "@/lib/validations";
import { formatarDataHora } from "@/lib/formatacao";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(consultaSchema),
  });

  const carregar = useCallback(async () => {
    const { data } = await supabase
      .from("consultas")
      .select("*, paciente:pacientes(nome), profissional:profissionais(nome)")
      .order("data_hora", { ascending: false });
    if (data) setConsultas(data);
    setLoading(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]); // eslint-disable-line react-hooks/set-state-in-effect

  function abrirModal(consulta = null) {
    setEditando(consulta);
    if (consulta) {
      reset({
        paciente_id: consulta.paciente_id,
        profissional_id: consulta.profissional_id,
        data_hora: consulta.data_hora?.slice(0, 16) || "",
        tipo: consulta.tipo,
        status: consulta.status,
        observacao: consulta.observacao || "",
      });
    } else {
      reset({ paciente_id: "", profissional_id: "", data_hora: "", tipo: "Primeira Consulta", status: "Agendada", observacao: "" });
    }
    setModalOpen(true);
  }

  async function onSubmit(data) {
    const promise = (async () => {
      if (editando) {
        const { error } = await supabase.from("consultas").update(data).eq("id", editando.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("consultas").insert(data);
        if (error) throw error;
      }
      setModalOpen(false);
      setEditando(null);
      await carregar();
    })();
    toast.promise(promise, { loading: editando ? "Atualizando..." : "Salvando...", success: "Feito!", error: (err) => err.message });
    try { await promise; } catch { /* empty */ }
  }

  async function handleExcluir(id) {
    if (!confirm("Excluir esta consulta?")) return;
    toast.promise(supabase.from("consultas").delete().eq("id", id), {
      loading: "Excluindo...",
      success: () => { carregar(); return "Excluída!"; },
      error: (err) => err.message,
    });
  }

  const statusVariant = (s) =>
    s === "Concluída" ? "success" : s === "Cancelada" ? "danger" : s === "Agendada" ? "info" : s === "Confirmada" ? "warning" : "default";

  const columns = [
    { key: "data_hora", label: "Data/Hora", sortable: true, render: (r) => formatarDataHora(r.data_hora) },
    { key: "paciente", label: "Paciente", render: (r) => r.paciente?.nome || "—" },
    { key: "profissional", label: "Profissional", render: (r) => r.profissional?.nome || "—" },
    { key: "tipo", label: "Tipo", sortable: true },
    { key: "status", label: "Status", render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div className="flex gap-2 justify-end">
          <button onClick={() => abrirModal(r)} className="text-xs text-[#8ba888] hover:text-[#7a9a78] font-medium">Editar</button>
          <button onClick={() => handleExcluir(r.id)} className="text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium">Excluir</button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-[#e5e7eb] rounded animate-pulse" />
        <div className="h-96 bg-white rounded-xl border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">Agenda de Consultas</h1>
        <p className="text-sm text-[#6b7280] mt-1">Controle de agendamentos e histórico de atendimentos</p>
      </div>

      <DataTable
        columns={columns}
        data={consultas}
        searchable
        searchField="paciente"
        searchPlaceholder="Buscar por paciente..."
        emptyMessage="Nenhuma consulta encontrada."
        actions={
          <button onClick={() => abrirModal()} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors">
            + Agendar Consulta
          </button>
        }
      />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditando(null); }} title={editando ? "Editar Consulta" : "Nova Consulta"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">ID do Paciente *</label>
            <input {...register("paciente_id")} placeholder="UUID do paciente" className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            {errors.paciente_id && <p className="text-xs text-destructive mt-1">{errors.paciente_id.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">ID do Profissional *</label>
            <input {...register("profissional_id")} placeholder="UUID do profissional" className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            {errors.profissional_id && <p className="text-xs text-destructive mt-1">{errors.profissional_id.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Data e Hora *</label>
            <input type="datetime-local" {...register("data_hora")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            {errors.data_hora && <p className="text-xs text-destructive mt-1">{errors.data_hora.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
              <select {...register("tipo")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="Primeira Consulta">Primeira Consulta</option>
                <option value="Retorno">Retorno</option>
                <option value="Avaliação">Avaliação</option>
                <option value="Exame">Exame</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Status</label>
              <select {...register("status")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
                <option value="Agendada">Agendada</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Observação</label>
            <textarea {...register("observacao")} rows={2} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }} className="px-4 py-1.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium disabled:opacity-50 transition-colors">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}