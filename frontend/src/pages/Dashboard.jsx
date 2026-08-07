import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
    const [metricas] = useState({
        pacientesAtivos: 128,
        consultasHoje: 14,
        medicosPlantao: 6,
        agendamentosSemana: 42,
    });

    const dadosAtendimentosSemana = [
        { dia: "Seg", atendimentos: 12 },
        { dia: "Ter", atendimentos: 19 },
        { dia: "Qua", atendimentos: 15 },
        { dia: "Qui", atendimentos: 22 },
        { dia: "Sex", atendimentos: 18 },
    ];

    const proximasConsultas = [
        { id: 1, paciente: "Ana Silva", medico: "Dr. Roberto Alves", hora: "09:00", status: "Confirmado" },
        { id: 2, paciente: "Mariana Costa", medico: "Dra. Patricia Lima", hora: "10:30", status: "Em Espera" },
        { id: 3, paciente: "Carlos Eduardo", medico: "Dr. Fernando Souza", hora: "11:15", status: "Confirmado" },
        { id: 4, paciente: "Lucas Pereira", medico: "Dr. Roberto Alves", hora: "13:30", status: "Confirmado" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Visão Geral</h1>
                <p className="text-xs text-slate-400 mt-1">Acompanhamento operacional em tempo real da clínica.</p>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pacientes Ativos</p>
                    <p className="text-3xl font-extrabold text-slate-100 mt-2">{metricas.pacientesAtivos}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Consultas Hoje</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-2">{metricas.consultasHoje}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Médicos de Plantão</p>
                    <p className="text-3xl font-extrabold text-slate-100 mt-2">{metricas.medicosPlantao}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Agendamentos (Semana)</p>
                    <p className="text-3xl font-extrabold text-slate-100 mt-2">{metricas.agendamentosSemana}</p>
                </div>
            </div>

            {/* Seção Principal: Gráfico + Tabela lado a lado em telas grandes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico de Atendimentos */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-200">Volume de Atendimentos</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Demanda diária na semana corrente</p>
                    </div>
                    <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dadosAtendimentosSemana}>
                                <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderColor: "#334155",
                                        color: "#f8fafc",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="atendimentos" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabela de Próximos Atendimentos */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-200">Próximos Atendimentos</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Fila de espera e consultas confirmadas</p>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono">● Atualizado agora</span>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-3.5">Horário</th>
                                    <th className="px-6 py-3.5">Paciente</th>
                                    <th className="px-6 py-3.5">Médico</th>
                                    <th className="px-6 py-3.5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-xs">
                                {proximasConsultas.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-emerald-400">{item.hora}</td>
                                        <td className="px-6 py-4 font-medium text-slate-200">{item.paciente}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.medico}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${item.status === "Confirmado"
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}