import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { pacienteSchema } from "@/lib/validations";
import { formatarDataISO } from "@/lib/formatacao";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(pacienteSchema) });

  const carregar = useCallback(async () => {
    const { data } = await supabase
      .from("pacientes")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPacientes(data);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { carregar(); }, [carregar]);

  function abrirModal(paciente = null) {
    setEditando(paciente);
    if (paciente) {
      reset({
        nome: paciente.nome,
        cpf: paciente.cpf || "",
        email: paciente.email || "",
        telefone: paciente.telefone || "",
        data_nascimento: paciente.data_nascimento || "",
        status: paciente.status,
      });
    } else {
      reset({ nome: "", cpf: "", email: "", telefone: "", data_nascimento: "", status: "Ativo" });
    }
    setModalOpen(true);
  }

  async function onSubmit(data) {
    const promise = (async () => {
      if (editando) {
        const { error } = await supabase.from("pacientes").update(data).eq("id", editando.id);
        if (error) throw error;
        toast.success("Paciente atualizado!");
      } else {
        const { error } = await supabase.from("pacientes").insert(data);
        if (error) throw error;
        toast.success("Paciente cadastrado!");
      }
      setModalOpen(false);
      setEditando(null);
      await carregar();
    })();
    toast.promise(promise, {
      loading: editando ? "Atualizando..." : "Salvando...",
      success: "Feito!",
      error: (err) => err.message,
    });
    try { await promise; } catch { /* toast handles */ }
  }

  async function handleExcluir(id) {
    if (!confirm("Excluir este paciente?")) return;
    toast.promise(supabase.from("pacientes").delete().eq("id", id), {
      loading: "Excluindo...",
      success: () => { carregar(); return "Excluído!"; },
      error: (err) => err.message,
    });
  }

  const columns = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "cpf", label: "CPF", sortable: true },
    { key: "email", label: "E-mail" },
    { key: "telefone", label: "Telefone" },
    { key: "data_nascimento", label: "Nascimento", render: (r) => formatarDataISO(r.data_nascimento) },
    { key: "status", label: "Status", render: (r) => <Badge variant={r.status === "Ativo" ? "success" : "default"}>{r.status}</Badge> },
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
        <h1 className="text-2xl font-bold text-[#1f2937]">Pacientes</h1>
        <p className="text-sm text-[#6b7280] mt-1">Gestão de pacientes cadastrados</p>
      </div>

      <DataTable
        columns={columns}
        data={pacientes}
        searchable
        searchField="nome"
        searchPlaceholder="Buscar por nome..."
        emptyMessage="Nenhum paciente cadastrado."
        actions={
          <button onClick={() => abrirModal()} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors">
            + Novo Paciente
          </button>
        }
      />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditando(null); }} title={editando ? "Editar Paciente" : "Novo Paciente"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nome *</label>
            <input {...register("nome")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            {errors.nome && <p className="text-xs text-destructive mt-1">{errors.nome.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">CPF</label>
              <input {...register("cpf")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nascimento</label>
              <input type="date" {...register("data_nascimento")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">E-mail</label>
              <input type="email" {...register("email")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
              <input {...register("telefone")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select {...register("status")} className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
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