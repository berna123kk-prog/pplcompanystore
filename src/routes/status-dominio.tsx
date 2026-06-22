import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react";
import { checkDomainDns } from "@/lib/dns.functions";

export const Route = createFileRoute("/status-dominio")({
  head: () => ({
    meta: [
      { title: "Status do domínio — PPL Company Store" },
      { name: "description", content: "Acompanhe a propagação DNS do domínio pplcompanystore.com." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StatusDominioPage,
});

function StatusBadge({ status }: { status: "ok" | "pendente" | "errado" }) {
  if (status === "ok") {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" /> Propagado
      </span>
    );
  }
  if (status === "errado") {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
        <XCircle className="h-4 w-4" /> Valor incorreto
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-medium">
      <Clock className="h-4 w-4" /> Aguardando propagação
    </span>
  );
}

function StatusDominioPage() {
  const fetchDns = useServerFn(checkDomainDns);
  const notified = useRef(false);

  const { data, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["dns-status"],
    queryFn: () => fetchDns(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data?.allOk && !notified.current) {
      notified.current = true;
      toast.success("Propagação concluída!", {
        description: "Todos os registros DNS estão corretos.",
      });
    }
  }, [data?.allOk]);

  const progress = data ? (data.okCount / data.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Status do domínio</h1>
          <p className="text-neutral-600 mt-2">
            Monitoramento em tempo real da propagação DNS de{" "}
            <span className="font-mono font-semibold">pplcompanystore.com</span>.
          </p>
        </header>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-neutral-500">Progresso geral</div>
              <div className="text-2xl font-semibold">
                {data ? `${data.okCount} de ${data.total} registros prontos` : "Carregando…"}
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Verificar agora
            </button>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {dataUpdatedAt > 0 && (
            <div className="text-xs text-neutral-500 mt-3">
              Última verificação: {new Date(dataUpdatedAt).toLocaleTimeString("pt-BR")} • atualiza automaticamente a cada 30s
            </div>
          )}
        </div>

        {data?.allOk && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-5 mb-6">
            <div className="font-semibold text-lg">✅ Propagação concluída!</div>
            <p className="text-sm mt-1">
              Todos os registros DNS estão visíveis publicamente. Agora o painel Lovable deve detectar
              automaticamente e emitir o certificado SSL nas próximas horas.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {data?.checks.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-xl border border-neutral-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold">{c.label}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Esperado: <span className="font-mono">{c.expected}</span>
                  </div>
                  <div className="text-xs text-neutral-700 mt-1 break-all">
                    Encontrado:{" "}
                    {c.found.length === 0 ? (
                      <span className="italic text-neutral-400">nenhum valor (NXDOMAIN)</span>
                    ) : (
                      <span className="font-mono">{c.found.join(", ")}</span>
                    )}
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-neutral-600 bg-white border border-neutral-200 rounded-xl p-5">
          <div className="font-semibold mb-1">Importante</div>
          <p>
            Após os 4 registros aparecerem como "Propagado", o painel Lovable ainda precisa confirmar
            a verificação e emitir o certificado SSL — isso pode levar mais alguns minutos.
            Acompanhe em <strong>Configurações do Projeto → Domínios</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
