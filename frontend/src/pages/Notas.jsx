import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { hojeShort } from "@/lib/formatacao";

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("notas")
          .select("*, paciente:pacientes(nome), profissional:profissionais(nome)")
          .order("created_at", { ascending: false }).limit(20);
        setNotas(data || []);
      } catch { /* offline */ } finally { setLoading(false) }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={hojeShort()}
        title="Notas"
        subtitle="Anotações rápidas sobre pacientes e atendimentos"
      />

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-20 bg-card rounded-xl border border-border animate-pulse" />)}
        </div>
      ) : notas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma nota registrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notas.map((n) => (
            <Card key={n.id} className="group-card">
              <CardContent className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{n.titulo}</span>
                  <Badge variant={n.prioridade === "alta" ? "warning" : n.prioridade === "urgente" ? "danger" : "default"}>{n.prioridade || "normal"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.conteudo}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                  <span>{n.paciente?.nome || "—"}</span>
                  <span>{new Date(n.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}