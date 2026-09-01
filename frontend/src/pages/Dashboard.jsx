import { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { saudacao, hoje } from "@/lib/formatacao";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { profile } = useAuth();
  const [metricas, setMetricas] = useState(null);
  const [consultasHoje, setConsultasHoje] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: met } = await supabase.from("metricas_dashboard").select("*").single();
        setMetricas(met || null);
        const { data: cons } = await supabase
          .from("consultas")
          .select("*, paciente:pacientes(nome), profissional:profissionais(nome)")
          .eq("status", "Agendada").order("data_hora", { ascending: true }).limit(8);
        setConsultasHoje(cons || []);
        const { data: logsData } = await supabase
          .from("atividade_logs")
          .select("*").order("created_at", { ascending: false }).limit(5);
        setLogs(logsData || []);
      } catch {
        // offline
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "consultas" }, () => {
        supabase.from("consultas")
          .select("*, paciente:pacientes(nome), profissional:profissionais(nome)")
          .eq("status", "Agendada").order("data_hora", { ascending: true }).limit(8)
          .then(({ data }) => data && setConsultasHoje(data));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const atendimentosSemana = [
    { dia: "Seg", atendimentos: 0 },
    { dia: "Ter", atendimentos: 0 },
    { dia: "Qua", atendimentos: 0 },
    { dia: "Qui", atendimentos: 0 },
    { dia: "Sex", atendimentos: 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {saudacao()}, {profile?.nome_completo?.split(" ")[0] || "usuario"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1 capitalize">{hoje()}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-zinc-800/50 rounded-xl border border-zinc-700/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Cards de Metrica com entrada em cascata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <Card className="group-card">
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Pacientes Ativos</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{metricas?.pacientes_ativos ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500 group-card">
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Consultas Hoje</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{metricas?.consultas_hoje ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 group-card">
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Receita Mensal</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(metricas?.receita_mensal ?? 0)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500 group-card">
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Taxa de Ocupacao</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{metricas?.taxa_ocupacao ?? 0}%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grafico de Atendimentos */}
            <Card className="group-card">
              <CardHeader>
                <h2 className="text-sm font-semibold text-zinc-100">Atendimentos da Semana</h2>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={atendimentosSemana}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="dia" tick={{ fill: "#a1a1aa", fontSize: 12 }} stroke="#3f3f46" />
                      <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} stroke="#3f3f46" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, color: "#e4e4e7", fontSize: 13 }}
                      />
                      <Bar dataKey="atendimentos" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Sessoes */}
            <Card className="group-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-100">Sessoes de Hoje</h2>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse-soft" />
                    Ao vivo
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                {consultasHoje.length === 0 ? (
                  <p className="text-sm text-zinc-500 px-6 py-4">Nenhuma consulta agendada para hoje.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm stagger-rows">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Horario</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Paciente</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Profissional</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {consultasHoje.map((c) => (
                          <tr key={c.id} className="hover:bg-zinc-800/40 transition-all duration-150 hover:scale-[1.005]">
                            <td className="px-6 py-3.5 font-medium text-zinc-200">
                              {new Date(c.data_hora).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-3.5 text-zinc-200">{c.paciente?.nome || "-"}</td>
                            <td className="px-6 py-3.5 text-zinc-400">{c.profissional?.nome || "-"}</td>
                            <td className="px-6 py-3.5">
                              <Badge variant={c.status === "Concluida" ? "success" : c.status === "Cancelada" ? "danger" : c.status === "Agendada" ? "info" : "default"}>
                                {c.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {logs.length > 0 && (
            <Card className="group-card">
              <CardHeader>
                <h2 className="text-sm font-semibold text-zinc-100">Atividades Recentes</h2>
              </CardHeader>
              <CardContent className="px-0">
                <div className="divide-y divide-zinc-800 stagger-rows">
                  {logs.map((log) => (
                    <div key={log.id} className="px-6 py-3 flex items-center gap-3 hover:bg-zinc-800/20 transition-colors">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                      <p className="text-sm text-zinc-300 flex-1">
                        <span className="font-medium">{log.acao}</span> - {log.entidade}
                      </p>
                      <span className="text-xs text-zinc-500">
                        {new Date(log.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}