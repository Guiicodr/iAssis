import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hojeShort } from "@/lib/formatacao";

export default function Evolucao() {
  const [evolucoes, setEvolucoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("evolucoes")
          .select("*, paciente:pacientes(nome), profissional:profissionais(nome)")
          .order("created_at", { ascending: false }).limit(20);
        setEvolucoes(data || []);
      } catch { /* offline */ } finally { setLoading(false) }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={hojeShort()}
        title="Evolução"
        subtitle="Registro de evolução clínica dos pacientes"
      />

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />)}
        </div>
      ) : evolucoes.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum registro de evolução encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {evolucoes.map((e) => (
            <Card key={e.id} className="group-card">
              <CardContent className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{e.paciente?.nome}</span>
                      <Badge variant="sage">{e.tipo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{e.descricao}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 text-right">
                    <p>{new Date(e.created_at).toLocaleDateString("pt-BR")}</p>
                    <p className="mt-0.5">{e.profissional?.nome?.split(" ")[0]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}