import { useState } from "react";

export default function IA() {
    const [sintomas, setSintomas] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [resultado, setResultado] = useState(null);

    function handleAnalise(e) {
        e.preventDefault();
        if (!sintomas.trim()) return;

        setCarregando(true);
        setResultado(null);

        setTimeout(() => {
            setResultado({
                hipoteses: ["Cefaleia Tensional", "Enxaqueca Sem Aura"],
                prioridade: "Média",
                sugestaoEncaminhamento: "Clínica Geral / Neurologia",
                observacoes: "Sintomas persistentes há 3 dias. Aferir pressão arterial na triagem antes do atendimento presencial.",
            });
            setCarregando(false);
        }, 1000);
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-100">Módulo de IA - Apoio à Triagem</h1>
                <p className="text-xs text-slate-400 mt-1">
                    Ferramenta de análise preditiva para classificação preliminar de queixas clínicas.
                </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-sm">
                <form onSubmit={handleAnalise} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Anamnese / Relato de Sintomas
                        </label>
                        <textarea
                            rows={6}
                            value={sintomas}
                            onChange={(e) => setSintomas(e.target.value)}
                            placeholder="Digite ou cole os relatos do paciente..."
                            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={carregando}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                            {carregando ? "Analisando..." : "Analisar Sintomas"}
                        </button>
                    </div>
                </form>
            </div>

            {resultado && (
                <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/30 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Relatório de Triagem Gerado
                        </h3>
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                            Prioridade: {resultado.prioridade}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <p className="font-bold text-slate-400 uppercase tracking-wider mb-2">Hipóteses Levantadas</p>
                            <ul className="list-disc list-inside text-slate-200 space-y-1">
                                {resultado.hipoteses.map((h, i) => (
                                    <li key={i}>{h}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <p className="font-bold text-slate-400 uppercase tracking-wider mb-2">Encaminhamento</p>
                            <p className="text-slate-200 font-medium">{resultado.sugestaoEncaminhamento}</p>
                        </div>
                    </div>

                    <div className="pt-2 text-xs">
                        <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Observações de Prontuário</p>
                        <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">{resultado.observacoes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}