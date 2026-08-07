import { useState } from "react";

const MOCK_CONSULTAS = [
    { id: 1, paciente: "Ana Silva", profissional: "Dr. Roberto Alves", data: "07/08/2026", horario: "09:00", tipo: "Retorno", status: "Agendada" },
    { id: 2, paciente: "Mariana Costa", profissional: "Dra. Patricia Lima", data: "07/08/2026", horario: "10:30", tipo: "Primeira Consulta", status: "Agendada" },
    { id: 3, paciente: "Carlos Eduardo", profissional: "Dr. Fernando Souza", data: "06/08/2026", horario: "14:00", tipo: "Avaliação", status: "Concluída" },
];

export default function Consultas() {
    const [consultas, setConsultas] = useState(MOCK_CONSULTAS);
    const [filtroStatus, setFiltroStatus] = useState("Todas");
    const [modalAberto, setModalAberto] = useState(false);

    const [novaConsulta, setNovaConsulta] = useState({
        paciente: "",
        profissional: "",
        data: "",
        horario: "",
        tipo: "Primeira Consulta",
    });

    const consultasFiltradas = consultas.filter((c) => {
        if (filtroStatus === "Todas") return true;
        return c.status === filtroStatus;
    });

    function handleSalvarConsulta(e) {
        e.preventDefault();
        setConsultas([{ id: Date.now(), ...novaConsulta, status: "Agendada" }, ...consultas]);
        setNovaConsulta({ paciente: "", profissional: "", data: "", horario: "", tipo: "Primeira Consulta" });
        setModalAberto(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Agenda de Consultas</h1>
                    <p className="text-xs text-slate-400 mt-1">Controle de agendamentos e histórico de atendimentos.</p>
                </div>

                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors self-start sm:self-auto"
                >
                    + Agendar Consulta
                </button>
            </div>

            {/* Filtros em Abas Dark */}
            <div className="flex gap-2 border-b border-slate-800 pb-3 text-xs">
                {["Todas", "Agendada", "Concluída", "Cancelada"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFiltroStatus(s)}
                        className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${filtroStatus === s
                                ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Data e Hora</th>
                            <th className="px-6 py-4">Paciente</th>
                            <th className="px-6 py-4">Médico / Especialista</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                        {consultasFiltradas.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                                    {c.data} às {c.horario}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-200">{c.paciente}</td>
                                <td className="px-6 py-4 text-slate-400">{c.profissional}</td>
                                <td className="px-6 py-4 text-slate-400">{c.tipo}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${c.status === "Agendada"
                                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                : c.status === "Concluída"
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                            }`}
                                    >
                                        {c.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-base font-bold text-slate-100">Agendar Consulta</h2>

                        <form onSubmit={handleSalvarConsulta} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">Paciente</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nome do paciente"
                                    value={novaConsulta.paciente}
                                    onChange={(e) => setNovaConsulta({ ...novaConsulta, paciente: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">Médico</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Dr. Roberto Alves"
                                    value={novaConsulta.profissional}
                                    onChange={(e) => setNovaConsulta({ ...novaConsulta, profissional: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-400 mb-1">Data</label>
                                    <input
                                        type="date"
                                        required
                                        value={novaConsulta.data}
                                        onChange={(e) => setNovaConsulta({ ...novaConsulta, data: e.target.value })}
                                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-400 mb-1">Horário</label>
                                    <input
                                        type="time"
                                        required
                                        value={novaConsulta.horario}
                                        onChange={(e) => setNovaConsulta({ ...novaConsulta, horario: e.target.value })}
                                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="px-4 py-2 border border-slate-800 hover:bg-slate-800 rounded text-slate-400 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded"
                                >
                                    Agendar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}