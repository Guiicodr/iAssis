import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { prontuarioSchema } from "@/lib/validations";
import { formatarDataHora } from "@/lib/formatacao";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function ProntuarioEletronico() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPront, setLoadingPront] = useState(false);

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
    setLoadingPront(true);
    reset({ paciente_id: paciente.id, subjetivo: "", objetivo: "", avaliacao: "", plano: "" });
    supabase
      .from("prontuarios")
      .select("*")
      .eq("paciente_id", paciente.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setProntuarios(data || []); setLoadingPront(false); });
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
    <div className="space-y-5">
      <PageHeader
        title="Prontuário Eletrônico"
        subtitle="Registro SOAP — Subjetivo, Objetivo, Avaliação e Plano"
      />
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1">
          <CardHeader className="py-3.5 px-5">
            <h2 className="text-sm font-semibold text-foreground">Pacientes</h2>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-muted rounded animate-pulse" />)}</div>
            ) : (
              <div className="divide-y divide-border">
                {pacientes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => selecionarPaciente(p)}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors hover:bg-muted/60 ${
                      pacienteSelecionado?.id === p.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {p.nome}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
<Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5">
            <h2 className="text-sm font-semibold text-foreground">
              {pacienteSelecionado ? `Evolações - ${pacienteSelecionado.nome}` : "Selecione um paciente"}
            </h2>
            {pacienteSelecionado && (
              <button
                onClick={() => { reset({ paciente_id: pacienteSelecionado.id, subjetivo: "", objetivo: "", avaliacao: "", plano: "" }); setModalOpen(true); }}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-colors"
              >
                + Novo Registro
              </button>
            )}
          </CardHeader>
          <CardContent className="p-5">
            {!pacienteSelecionado ? (
              <p className="text-sm text-muted-foreground">Selecione um paciente ao lado para ver o histórico de evoluções SOAP.</p>
            ) : loadingPront ? (
              <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}</div>
            ) : prontuarios.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">Nenhum prontuário registrado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prontuarios.map((p) => (
                  <div key={p.id} className="bg-muted/30 rounded-lg border border-border p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{formatarDataHora(p.data)}</span>
                      <Badge variant="sage">SOAP</Badge>
                    </div>
                    {p.subjetivo && <div><p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">S — Subjetivo</p><p className="text-sm text-foreground mt-1">{p.subjetivo}</p></div>}
                    {p.objetivo && <div><p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">O — Objetivo</p><p className="text-sm text-foreground mt-1">{p.objetivo}</p></div>}
                    {p.avaliacao && <div><p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">A — Avaliação</p><p className="text-sm text-foreground mt-1">{p.avaliacao}</p></div>}
                    {p.plano && <div><p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">P — Plano</p><p className="text-sm text-foreground mt-1">{p.plano}</p></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
<Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Registro SOAP">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">S — Subjetivo</label>
            <textarea {...register("subjetivo")} rows={3} placeholder="Queixas, sintomas, história..." className="w-full px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">O — Objetivo</label>
            <textarea {...register("objetivo")} rows={3} placeholder="Exame físico, sinais vitais..." className="w-full px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">A — Avaliação</label>
            <textarea {...register("avaliacao")} rows={3} placeholder="Hipóteses diagnósticas..." className="w-full px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">P — Plano</label>
            <textarea {...register("plano")} rows={3} placeholder="Conduta, exames, medicações..." className="w-full px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-1.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium disabled:opacity-50 transition-colors">{isSubmitting ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
