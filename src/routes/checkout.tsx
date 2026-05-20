import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { TopBanner, Header, Footer } from "@/components/storefront";
import { useCart } from "@/lib/cart";
import { createDeposit, checkTransaction, type DepositResult } from "@/lib/elitepay.functions";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function onlyDigits(s: string) {
  return s.replace(/\D+/g, "");
}

function formatCpf(s: string) {
  const d = onlyDigits(s).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [pix, setPix] = useState<DepositResult | null>(null);
  const [status, setStatus] = useState<string>("PENDING");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pix?.transactionId) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const r = await checkTransaction({ data: { transactionId: pix.transactionId! } });
        setStatus(r.status);
        if (["COMPLETO", "COMPLETED", "PAID", "APPROVED"].includes(r.status)) {
          if (pollRef.current) clearInterval(pollRef.current);
          toast.success("Pagamento confirmado!");
          clear();
          setTimeout(() => navigate({ to: "/" }), 1500);
        }
      } catch {}
    }, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pix?.transactionId, clear, navigate]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Sua sacola está vazia");
      return;
    }
    const doc = onlyDigits(cpf);
    if (doc.length !== 11) {
      toast.error("CPF inválido");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Informe seu nome completo");
      return;
    }
    setLoading(true);
    try {
      const description = `Pedido ${items.length} item(ns) - ${items.map((i) => i.title).join(", ").slice(0, 150)}`;
      const result = await createDeposit({
        data: {
          amount: Number(total.toFixed(2)),
          description,
          payerName: name.trim(),
          payerDocument: doc,
        },
      });
      if (!result.qrCode && !result.qrCodeImage) {
        throw new Error("Gateway não retornou o código PIX.");
      }
      setPix(result);
      setStatus("PENDING");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao gerar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const copyPix = async () => {
    if (!pix?.qrCode) return;
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopied(true);
      toast.success("Código copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBanner />
      <Header />

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-bold text-sky-700 hover:text-sky-900 mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> Continuar comprando
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-sky-900 uppercase tracking-[0.1em]">
          Finalizar compra
        </h1>

        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-10">
          <div>
            {!pix ? (
              <form onSubmit={handleGenerate} className="space-y-5 border border-sky-100 p-6 bg-white">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-sky-700 mb-2">
                    Nome completo
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como está no documento"
                    className="w-full border border-sky-200 px-4 py-3 text-sm text-sky-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-sky-700 mb-2">
                    CPF
                  </label>
                  <input
                    value={cpf}
                    onChange={(e) => setCpf(formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="w-full border border-sky-200 px-4 py-3 text-sm text-sky-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-extrabold uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Gerando PIX..." : "Gerar PIX"}
                </button>
                <p className="text-[11px] text-slate-500 text-center">
                  Pagamento processado de forma segura via Elite PAY.
                </p>
              </form>
            ) : (
              <div className="border border-sky-100 p-6 bg-white text-center">
                <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-sky-700">
                  Pague com PIX para concluir
                </p>
                <p className="mt-2 text-2xl font-extrabold text-sky-900">
                  R$ {total.toFixed(2).replace(".", ",")}
                </p>

                <div className="mt-5 inline-block p-4 border border-sky-200 bg-white">
                  {pix.qrCodeImage ? (
                    <img
                      src={pix.qrCodeImage.startsWith("data:") ? pix.qrCodeImage : `data:image/png;base64,${pix.qrCodeImage}`}
                      alt="QR Code PIX"
                      className="w-[240px] h-[240px] object-contain"
                    />
                  ) : pix.qrCode ? (
                    <QRCodeSVG value={pix.qrCode} size={240} level="M" />
                  ) : null}
                </div>

                {pix.qrCode && (
                  <div className="mt-5 text-left">
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-sky-700 mb-2">
                      PIX Copia e Cola
                    </p>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={pix.qrCode}
                        className="flex-1 border border-sky-200 px-3 py-2 text-xs text-sky-900 bg-sky-50 truncate"
                      />
                      <button
                        type="button"
                        onClick={copyPix}
                        className="px-4 bg-sky-900 hover:bg-sky-800 text-white text-[11px] font-bold uppercase tracking-[0.15em] inline-flex items-center gap-1"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-bold text-sky-700">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Aguardando pagamento... ({status})
                </div>

                <p className="mt-4 text-[11px] text-slate-500">
                  Esta tela atualiza automaticamente quando o pagamento for confirmado.
                </p>
              </div>
            )}
          </div>

          <aside className="border border-sky-100 p-6 bg-white h-fit">
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-sky-700 mb-4">
              Resumo do pedido
            </p>
            <ul className="divide-y divide-sky-100">
              {items.map((it, idx) => (
                <li key={`${it.slug}-${idx}`} className="py-3 flex gap-3">
                  <img src={it.img} alt={it.title} className="h-14 w-14 object-contain border border-sky-100 bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-sky-900 line-clamp-2">{it.title}</p>
                    {it.size && <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mt-1">Tam: {it.size}</p>}
                    <p className="text-[11px] text-sky-700 mt-1">{it.qty} × R$ {it.price}</p>
                  </div>
                </li>
              ))}
              {items.length === 0 && (
                <li className="py-4 text-center text-xs text-slate-500">Sacola vazia</li>
              )}
            </ul>
            <div className="border-t border-sky-100 mt-4 pt-4 flex items-center justify-between text-sky-900">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Total</span>
              <span className="text-xl font-extrabold">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
