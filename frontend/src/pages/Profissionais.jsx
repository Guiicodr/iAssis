import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { profissionalSchema } from "@/lib/validations";
import DataTable from "@/components/DataTable";
import { Modal } from "@/components/ui/modal";

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profissionalSchema),
  });

  const carregar = useCallback(async () => {
    const { data } = await supabase.from("profissionais").select("*").order("created_at", { ascending: false });
    if (data) setProfissionais(data);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { carregar(); }, [carregar]);

  function abrirModal(prof = null) {
    setEditando(prof);
    if (prof) {
      reset({ nome: prof.nome, especialidade: prof.especialidade, crm: prof.crm || "", email: prof.email || "", telefone: prof.telefone || "", disponibilidade: prof.disponibilidade || "" });
    } else {
      reset({ nome: "", especialidade: "", crm: "", email: "", telefone: "", disponibilidade: "" });
    }
    setModalOpen(true);
  }

  async function onSubmit(data) {
    const promise = (async () => {
      if (editando) {
        const { error } = await supabase.from("profissionais").update(data).eq("id", editando.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profissionais").insert(data);
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
    if (!confirm("Excluir este profissional?")) return;
    toast.promise(supabase.from("profissionais").delete().eq("id", id), {
      loading: "Excluindo...",
      success: () => { carregar(); return "Excluído!"; },
      error: (err) => err.message,
    });
  }

  const columns = [
    { key: "nome", label: "Nome", sortable: true },
    { key: "especialidade", label: "Especialidade", sortable: true },
    { key: "crm", label: "CRM" },
    { key: "email", label: "E-mail" },
    { key: "telefone", label: "Telefone" },
    { key: "disponibilidade", label: "Disponibilidade" },
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
        <h1 className="text-2xl font-bold text-[#1f2937]">Corpo Médico</h1>
        <p className="text-sm text-[#6b7280] mt-1">Gestão de profissionais e especialidades</p>
      </div>

      <DataTable
        columns={columns}
        data={profissionais}
        searchable
        searchField="nome"
        searchPlaceholder="Buscar por nome..."
        emptyMessage="Nenhum profissional cadastrado."
        actions={
          <button onClick={() => abrirModal()} className="px-4 py-2 rounded-lg bg-[#8ba888] hover:bg-[#7a9a78] text-white text-sm font-medium transition-colors">
            + Novo Profissional
          </button>
        }
      />

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditando(null); }} title={editando ? "Editar Profissional" : "Novo Profissional"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Nome *</label>
            <input {...register("nome")} className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]" />
            {errors.nome && <p className="text-xs text-[#dc2626] mt-1">{errors.nome.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Especialidade *</label>
              <input {...register("especialidade")} className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]" />
              {errors.especialidade && <p className="text-xs text-[#dc2626] mt-1">{errors.especialidade.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">CRM</label>
              <input {...register("crm")} placeholder="000000-SP" className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">E-mail</label>
              <input type="email" {...register("email")} className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Telefone</label>
              <input {...register("telefone")} className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Disponibilidade</label>
            <input {...register("disponibilidade")} placeholder="Ex: Seg / Qua / Sex" className="w-full px-3 py-2 rounded-lg border border-[#d1d5db] text-sm focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); setEditando(null); }} className="px-4 py-2 border border-[#d1d5db] rounded-lg text-sm text-[#6b7280] hover:bg-[#f3f4f6]">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-[#8ba888] hover:bg-[#7a9a78] text-white text-sm font-medium disabled:opacity-50">
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}