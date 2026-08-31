import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { prontuarioSchema } from "@/lib/validations";
import { formatarDataHora } from "@/lib/formatacao";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function ProntuarioEletronico() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(prontuarioSchema),
  });

  useEffect(() => {
    supabase.from("pacientes").select("id, nome").order("nome").then(({ data }) => {
      if (data) setPacientes(data);
      setLoading(false);
    });
  }, []);

  function selecionarPaciente(paciente) {
    setPacienteSelecionado(paciente);
    setModalOpen(true);
    reset({ paciente_id: paciente.id, subjetivo: "", objetivo: "", avaliacao: "", plano: "" });
    supabase
      .from("prontuarios")
      .select("*")
      .eq("paciente_id", paciente.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProntuarios(data || []));
  }

  async function onSubmit(data) {
    const promise = supabase.from("prontuarios").insert(data);
    toast.promise(promise, {
      loading: "Salvando prontuário...",
      success: () => {
        setModalOpen(false);
        supabase
          .from("prontuarios")
          .select("*")
          .eq("paciente_id", data.paciente_id)
          .order("created_at", { ascending: false })
          .then(({ data: d }) => setProntuarios(d || []));
        return "Prontuário registrado!";
      },
      error: (err) => err.message,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Prontuário Eletrônico</h1>
        <p className="text-sm text-zinc-400 mt-1">Registro SOAP — Subjetivo, Objetivo, Avaliação e Plano</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><h2 className="text-sm font-semibold text-zinc-100">Pacientes</h2></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />)}</div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {pacientes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selecionarPaciente(p)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-zinc-800 ${pacienteSelecionado?.id === p.id ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-300"}`}
                  >
                    {p.nome}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-zinc-100">
              {pacienteSelecionado ? `Evoluções - ${pacienteSelecionado.nome}` : "Selecione um paciente"}
            </h2>
          </CardHeader>
          <CardContent>
            {!pacienteSelecionado ? (
              <p className="text-sm text-zinc-500">Selecione um paciente ao lado para ver o histórico de evoluções SOAP.</p>
            ) : prontuarios.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-500 mb-4">Nenhum prontuário registrado.</p>
                <button onClick={() => { reset({ paciente_id: pacienteSelecionado.id, subjetivo: "", objetivo: "", avaliacao: "", plano: "" }); setModalOpen(true); }} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
                  + Novo Registro SOAP
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button onClick={() => { reset({ paciente_id: pacienteSelecionado.id, subjetivo: "", objetivo: "", avaliacao: "", plano: "" }); setModalOpen(true); }} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
                    + Novo Registro
                  </button>
                </div>
                {prontuarios.map((p) => (
                  <div key={p.id} className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-medium text-zinc-400">{formatarDataHora(p.data)}</span>
                      <Badge variant="info">SOAP</Badge>
                    </div>
                    {p.subjetivo && <div><p className="text-xs font-semibold text-zinc-400 uppercase">S — Subjetivo</p><p className="text-sm text-zinc-300 mt-1">{p.subjetivo}</p></div>}
                    {p.objetivo && <div><p className="text-xs font-semibold text-zinc-400 uppercase">O — Objetivo</p><p className="text-sm text-zinc-300 mt-1">{p.objetivo}</p></div>}
                    {p.avaliacao && <div><p className="text-xs font-semibold text-zinc-400 uppercase">A — Avaliação</p><p className="text-sm text-zinc-300 mt-1">{p.avaliacao}</p></div>}
                    {p.plano && <div><p className="text-xs font-semibold text-zinc-400 uppercase">P — Plano</p><p className="text-sm text-zinc-300 mt-1">{p.plano}</p></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Registro SOAP">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">S — Subjetivo</label>
            <textarea {...register("subjetivo")} rows={3} placeholder="Queixas, sintomas, história..." className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">O — Objetivo</label>
            <textarea {...register("objetivo")} rows={3} placeholder="Exame físico, sinais vitais..." className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">A — Avaliação</label>
            <textarea {...register("avaliacao")} rows={3} placeholder="Hipóteses diagnósticas..." className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">P — Plano</label>
            <textarea {...register("plano")} rows={3} placeholder="Conduta, exames, medicações..." className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-zinc-700 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50">{isSubmitting ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}