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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            {saudacao()}, {profile?.nome_completo?.split(" ")[0] || "usuário"}
          </h1>
          <p className="text-sm text-[#6b7280] mt-1 capitalize">{hoje()}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl border border-[#e5e7eb] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Pacientes Ativos</p>
                <p className="text-2xl font-bold text-[#1f2937] mt-1">{metricas?.pacientes_ativos ?? 0}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-[#8ba888]">
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Consultas Hoje</p>
                <p className="text-2xl font-bold text-[#8ba888] mt-1">{metricas?.consultas_hoje ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Profissionais</p>
                <p className="text-2xl font-bold text-[#1f2937] mt-1">{metricas?.total_profissionais ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="px-5 py-5">
                <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">Presença (30d)</p>
                <p className="text-2xl font-bold text-[#1f2937] mt-1">{metricas?.taxa_presenca_30d ?? 0}%</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <h2 className="text-sm font-semibold text-[#1f2937]">Atendimentos na Semana</h2>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={atendimentosSemana}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="dia" tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          borderColor: "#e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#374151",
                        }}
                      />
                      <Bar dataKey="atendimentos" fill="#8ba888" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#1f2937]">Sessões de Hoje</h2>
                  <span className="text-xs text-[#8ba888] font-medium">● Ao vivo</span>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                {consultasHoje.length === 0 ? (
                  <p className="text-sm text-[#9ca3af] px-6 py-4">Nenhuma consulta agendada para hoje.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#e5e7eb]">
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase">Horário</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase">Paciente</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase">Profissional</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb]">
                        {consultasHoje.map((c) => (
                          <tr key={c.id} className="hover:bg-[#f9fafb] transition-colors">
                            <td className="px-6 py-3.5 font-medium text-[#374151]">
                              {new Date(c.data_hora).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-3.5 text-[#374151]">{c.paciente?.nome || "—"}</td>
                            <td className="px-6 py-3.5 text-[#6b7280]">{c.profissional?.nome || "—"}</td>
                            <td className="px-6 py-3.5">
                              <Badge variant={c.status === "Concluída" ? "success" : c.status === "Cancelada" ? "danger" : c.status === "Agendada" ? "info" : "default"}>
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
            <Card>
              <CardHeader>
                <h2 className="text-sm font-semibold text-[#1f2937]">Atividades Recentes</h2>
              </CardHeader>
              <CardContent className="px-0">
                <div className="divide-y divide-[#e5e7eb]">
                  {logs.map((log) => (
                    <div key={log.id} className="px-6 py-3 flex items-center gap-3">
                      <div className="size-2 rounded-full bg-[#8ba888]" />
                      <p className="text-sm text-[#374151] flex-1">
                        <span className="font-medium">{log.acao}</span> — {log.entidade}
                      </p>
                      <span className="text-xs text-[#9ca3af]">
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