import { useState } from "react";

const MOCK_PROFISSIONAIS = [
    { id: 1, nome: "Dr. Roberto Alves", crm: "123456-SP", especialidade: "Cardiologia", disponibilidade: "Seg / Quar / Sex" },
    { id: 2, nome: "Dra. Patricia Lima", crm: "654321-SP", especialidade: "Neurologia", disponibilidade: "Ter / Qui" },
    { id: 3, nome: "Dr. Fernando Souza", crm: "789123-SP", especialidade: "Clínica Geral", disponibilidade: "Seg a Sex" },
];

export default function Profissionais() {
    const [profissionais, setProfissionais] = useState(MOCK_PROFISSIONAIS);
    const [modalAberto, setModalAberto] = useState(false);

    const [novoProfissional, setNovoProfissional] = useState({
        nome: "",
        crm: "",
        especialidade: "",
        disponibilidade: "",
    });

    function handleSalvarProfissional(e) {
        e.preventDefault();
        setProfissionais([{ id: Date.now(), ...novoProfissional }, ...profissionais]);
        setNovoProfissional({ nome: "", crm: "", especialidade: "", disponibilidade: "" });
        setModalAberto(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Corpo Médico</h1>
                    <p className="text-xs text-slate-400 mt-1">Gestão de corpo clínico e especialidades cadastradas.</p>
                </div>

                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors self-start sm:self-auto"
                >
                    + Novo Profissional
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4">Profissional</th>
                            <th className="px-6 py-4">CRM / Registro</th>
                            <th className="px-6 py-4">Especialidade</th>
                            <th className="px-6 py-4">Disponibilidade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                        {profissionais.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{p.nome}</td>
                                <td className="px-6 py-4 text-slate-400 font-mono">{p.crm}</td>
                                <td className="px-6 py-4 font-semibold text-emerald-400">{p.especialidade}</td>
                                <td className="px-6 py-4 text-slate-400">{p.disponibilidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-base font-bold text-slate-100">Cadastrar Profissional</h2>

                        <form onSubmit={handleSalvarProfissional} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Dr. Roberto Alves"
                                    value={novoProfissional.nome}
                                    onChange={(e) => setNovoProfissional({ ...novoProfissional, nome: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">CRM / Conselho</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="000000-SP"
                                    value={novoProfissional.crm}
                                    onChange={(e) => setNovoProfissional({ ...novoProfissional, crm: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">Especialidade</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Cardiologia"
                                    value={novoProfissional.especialidade}
                                    onChange={(e) => setNovoProfissional({ ...novoProfissional, especialidade: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-400 mb-1">Dias de Atendimento</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Seg / Ter / Sex"
                                    value={novoProfissional.disponibilidade}
                                    onChange={(e) => setNovoProfissional({ ...novoProfissional, disponibilidade: e.target.value })}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
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