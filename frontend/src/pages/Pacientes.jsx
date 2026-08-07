import { useState } from "react";

const MOCK_PACIENTES = [
    { id: 1, nome: "Ana Silva", cpf: "123.456.789-00", email: "ana.silva@email.com", telefone: "(11) 98765-4321", status: "Ativo", ultimaConsulta: "02/08/2026" },
    { id: 2, nome: "Carlos Eduardo", cpf: "987.654.321-11", email: "carlos.edu@email.com", telefone: "(11) 91234-5678", status: "Inativo", ultimaConsulta: "15/05/2026" },
    { id: 3, nome: "Mariana Costa", cpf: "456.789.123-22", email: "mariana.c@email.com", telefone: "(11) 97777-8888", status: "Ativo", ultimaConsulta: "05/08/2026" },
];

export default function Pacientes() {
    const [pacientes, setPacientes] = useState(MOCK_PACIENTES);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);

    const [novoPaciente, setNovoPaciente] = useState({ nome: "", cpf: "", email: "", telefone: "" });

    const pacientesFiltrados = pacientes.filter(
        (p) => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.cpf.includes(busca)
    );

    function handleSalvarPaciente(e) {
        e.preventDefault();
        setPacientes([{ id: Date.now(), ...novoPaciente, status: "Ativo", ultimaConsulta: "Hoje" }, ...pacientes]);
        setNovoPaciente({ nome: "", cpf: "", email: "", telefone: "" });
        setModalAberto(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Pacientes</h1>
                    <p className="text-xs text-slate-400 mt-1">Gestão de prontuários e contatos dos pacientes.</p>
                </div>

                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors self-start sm:self-auto"
                >
                    + Novo Paciente
                </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <input
                    type="text"
                    placeholder="Buscar paciente por nome ou CPF..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">CPF</th>
                            <th className="px-6 py-4">Contato</th>
                            <th className="px-6 py-4">Última Consulta</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                        {pacientesFiltrados.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{p.nome}</td>
                                <td className="px-6 py-4 text-slate-400 font-mono">{p.cpf}</td>
                                <td className="px-6 py-4 text-slate-400">
                                    <div>{p.email}</div>
                                    <div className="text-[11px] text-slate-500">{p.telefone}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{p.ultimaConsulta}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${p.status === "Ativo"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-slate-800 text-slate-400"
                                            }`}
                                    >
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-emerald-400 hover:underline font-semibold text-xs">
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-base font-bold text-slate-100">Novo Cadastro</h2>

                        <form onSubmit={handleSalvarPaciente} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={novoPaciente.nome}
                                    onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">CPF</label>
                                <input
                                    type="text"
                                    required
                                    value={novoPaciente.cpf}
                                    onChange={(e) => setNovoPaciente({ ...novoPaciente, cpf: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-slate-400 mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        required
                                        value={novoPaciente.email}
                                        onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
                                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-slate-400 mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        required
                                        value={novoPaciente.telefone}
                                        onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
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
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}