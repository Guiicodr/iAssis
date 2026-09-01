import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCountUp } from "@/hooks/useCountUp";

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [consultasHoje, setConsultasHoje] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: met } = await supabase.from("metricas_dashboard").select("*").single();
        setMetricas(met);
        const { data: cons } = await supabase.from("consultas")
          .select("*, paciente:pacientes(nome), profissional:profissionais(nome)")
          .eq("status", "Agendada").order("data_hora", { ascending: true }).limit(8);
        setConsultasHoje(cons || []);
        const { data: al } = await supabase.from("alertas")
          .select("*, paciente:pacientes(nome)").order("created_at", { ascending: false }).limit(5);
        setAlertas(al || []);
        const { data: pac } = await supabase.from("pacientes")
          .select("*, consultas:consultas(status)").order("nome").limit(6);
        if (pac) {
          const enriquecidos = pac.map((p) => {
            const total = p.consultas?.length || 0;
            const concluidas = p.consultas?.filter((c) => c.status === "Concluída").length || 0;
            const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
            return { ...p, progresso };
          });
          setPacientes(enriquecidos);
        }
      } catch { /* offline */ } finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-56 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />)}
        </div>
      </div>
    );
  }

  return <DashboardContent
    metricas={metricas}
    consultasHoje={consultasHoje}
    alertas={alertas}
    pacientes={pacientes}
  />;
}

function StatCard({ label, value, icon, color }) {
  const animated = useCountUp(value, 1200);
  return (
    <Card className="group-card">
      <CardContent className="px-5 py-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1 font-serif">{animated}</p>
        </div>
        <div className={`size-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function PacienteCard({ paciente }) {
  return (
    <Card className="group-card">
      <CardContent className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
            {paciente.nome?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">{paciente.nome}</p>
            <p className="text-xs text-muted-foreground">
              {paciente.consultas?.length || 0} sessões • {paciente.progresso}%
            </p>
          </div>
          <Badge variant={paciente.status === "Ativo" ? "sage" : "default"}>{paciente.status}</Badge>
        </div>
        <Progress value={paciente.progresso} />
      </CardContent>
    </Card>
  );
}
function DashboardContent({ metricas, consultasHoje, alertas, pacientes }) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()} · ${new Date().getFullYear()}`}
        title={`Bom dia, Marina`}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card px-3 py-1.5 rounded-full border border-border">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
          {metricas?.consultas_hoje ?? 0} consultas hoje
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard label="Sessões Hoje" value={metricas?.consultas_hoje ?? 0}
          icon={<CalendarIcon />} color="bg-primary/10 text-primary" />
        <StatCard label="Pacientes Ativos" value={metricas?.pacientes_ativos ?? 0}
          icon={<UsersIcon />} color="bg-blue-500/10 text-blue-600" />
        <StatCard label="Taxa Presença" value={metricas?.taxa_presenca_30d ?? 0}
          icon={<TrendIcon />} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard label="Agendamentos/Sem" value={metricas?.agendamentos_semana ?? 0}
          icon={<CalendarCheckIcon />} color="bg-amber-500/10 text-amber-600" />
      </div>

      {/* Pacientes cards */}
      {pacientes.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Pacientes em Acompanhamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {pacientes.map((p) => <PacienteCard key={p.id} paciente={p} />)}
          </div>
        </div>
      )}

      {/* Consultas Hoje + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="group-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Sessões de Hoje</h2>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full">
                Ao vivo
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {consultasHoje.length === 0 ? (
              <p className="text-sm text-muted-foreground px-6 py-4">Nenhuma consulta agendada.</p>
            ) : (
              <div className="divide-y divide-border stagger-rows">
                {consultasHoje.map((c) => (
                  <div key={c.id} className="px-6 py-3 flex items-center gap-4 hover:bg-muted/40 transition-colors">
                    <div className="text-xs font-semibold text-foreground w-14 shrink-0">
                      {new Date(c.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{c.paciente?.nome}</p>
                      <p className="text-xs text-muted-foreground">{c.tipo}</p>
                    </div>
                    <Badge variant={c.status === "Agendada" ? "amber" : "sage"}>{c.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="group-card">
          <CardHeader>
            <h2 className="text-sm font-semibold text-foreground">Alertas Clínicos</h2>
          </CardHeader>
          <CardContent className="px-0">
            {alertas.length === 0 ? (
              <p className="text-sm text-muted-foreground px-6 py-4">Nenhum alerta.</p>
            ) : (
              <div className="divide-y divide-border stagger-rows">
                {alertas.map((a) => (
                  <div key={a.id} className="px-6 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors">
                    <div className={`size-2 rounded-full shrink-0 ${a.prioridade === "urgente" ? "bg-red-500" : a.prioridade === "alta" ? "bg-amber-500" : "bg-primary"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground truncate">{a.mensagem}</p>
                      {a.paciente && <p className="text-xs text-muted-foreground">{a.paciente.nome}</p>}
                    </div>
                    <Badge variant={a.prioridade === "urgente" ? "danger" : a.prioridade === "alta" ? "warning" : "sage"}>{a.tipo}</Badge>
</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CalendarIcon() { return <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>; }
function UsersIcon() { return <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>; }
function TrendIcon() { return <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>; }
function CalendarCheckIcon() { return <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>; }
