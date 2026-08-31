import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        <h1 className="text-2xl font-bold text-[#1f2937]">Módulo de IA</h1>
        <p className="text-sm text-[#6b7280] mt-1">Ferramenta de análise preditiva para classificação preliminar de queixas clínicas</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[#1f2937]">Anamnese / Relato de Sintomas</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalise} className="space-y-4">
            <textarea
              rows={6}
              value={sintomas}
              onChange={(e) => setSintomas(e.target.value)}
              placeholder="Digite ou cole os relatos do paciente..."
              className="w-full p-4 border border-[#d1d5db] rounded-lg text-sm text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8ba888]/40 focus:border-[#8ba888]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={carregando}
                className="px-5 py-2.5 rounded-lg bg-[#8ba888] hover:bg-[#7a9a78] text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {carregando ? "Analisando..." : "Analisar Sintomas"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {resultado && (
        <Card className="border-l-4 border-l-[#8ba888]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1f2937]">Relatório de Triagem</h2>
              <span className="text-xs font-medium text-[#92400e] bg-[#fef3c7] px-2.5 py-1 rounded-full">
                Prioridade: {resultado.prioridade}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e5e7eb]">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">Hipóteses</p>
                <ul className="list-disc list-inside text-sm text-[#374151] space-y-1">
                  {resultado.hipoteses.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
              <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e5e7eb]">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">Encaminhamento</p>
                <p className="text-sm text-[#374151] font-medium">{resultado.sugestaoEncaminhamento}</p>
              </div>
            </div>
            <div className="bg-[#f9fafb] p-4 rounded-lg border border-[#e5e7eb]">
              <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">Observações</p>
              <p className="text-sm text-[#374151]">{resultado.observacoes}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}