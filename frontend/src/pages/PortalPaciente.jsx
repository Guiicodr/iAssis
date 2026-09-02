import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { formatarDataHora } from "@/lib/formatacao";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PortalPaciente() {
  const { user, profile } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [prontuarios, setProntuarios] = useState([]);
  const [prescricoes, setPrescricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: paciente } = await supabase.from("pacientes").select("id").eq("email", user?.email).maybeSingle();
        if (paciente) {
          const [cons, pro, pre] = await Promise.all([
            supabase.from("consultas").select("*, profissional:profissionais(nome)").eq("paciente_id", paciente.id).order("data_hora", { ascending: false }),
            supabase.from("prontuarios").select("*").eq("paciente_id", paciente.id).order("created_at", { ascending: false }),
            supabase.from("prescricoes").select("*").eq("paciente_id", paciente.id).eq("status", "ativa").order("created_at", { ascending: false }),
          ]);
          if (cons.data) setConsultas(cons.data);
          if (pro.data) setProntuarios(pro.data);
          if (pre.data) setPrescricoes(pre.data);
        }
      } catch { /* prevented by toast */ } finally { setLoading(false); }
    }
    load();
  }, [user]);

  if (loading) return <div className="space-y-5"><div className="h-8 w-64 bg-muted rounded animate-pulse" /><div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-card rounded-xl border border-border animate-pulse" />)}</div></div>;

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Portal do Paciente</h1>
        <p className="text-sm text-muted-foreground mt-1">Olá, {profile?.nome_completo || "Paciente"}! Acompanhe seu histórico clínico.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="py-3.5"><h2 className="text-sm font-semibold text-foreground">Minhas Consultas</h2></CardHeader>
          <CardContent>
            {consultas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma consulta agendada.</p>
            ) : (
              <div className="space-y-3">
                {consultas.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.profissional?.nome || "Profissional"}</p>
                      <p className="text-xs text-muted-foreground">{formatarDataHora(c.data_hora)}</p>
                    </div>
                    <Badge variant={c.status === "Concluída" ? "success" : c.status === "Cancelada" ? "danger" : "info"}>{c.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3.5"><h2 className="text-sm font-semibold text-foreground">Prescrições Ativas</h2></CardHeader>
          <CardContent>
            {prescricoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma prescrição ativa.</p>
            ) : (
              <div className="space-y-3">
                {prescricoes.map((p) => (
                  <div key={p.id} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{p.medicamento}</p>
                      <Badge variant="success">Ativa</Badge>
                    </div>
                    {p.posologia && <p className="text-xs text-muted-foreground mt-1">{p.posologia}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3.5"><h2 className="text-sm font-semibold text-foreground">Histórico de Evoluções</h2></CardHeader>
        <CardContent>
          {prontuarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum prontuário registrado.</p>
          ) : (
            <div className="space-y-3">
              {prontuarios.map((p) => (
                <div key={p.id} className="bg-muted/30 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{formatarDataHora(p.data)}</span>
                    <Badge variant="sage">SOAP</Badge>
                  </div>
                  {p.subjetivo && <p className="text-xs text-foreground"><span className="font-semibold text-muted-foreground">S:</span> {p.subjetivo}</p>}
                  {p.objetivo && <p className="text-xs text-foreground mt-1"><span className="font-semibold text-muted-foreground">O:</span> {p.objetivo}</p>}
                  {p.avaliacao && <p className="text-xs text-foreground mt-1"><span className="font-semibold text-muted-foreground">A:</span> {p.avaliacao}</p>}
                  {p.plano && <p className="text-xs text-foreground mt-1"><span className="font-semibold text-muted-foreground">P:</span> {p.plano}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}