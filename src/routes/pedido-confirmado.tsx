import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Package, MapPin, User, Mail, Phone, FileText, Home } from "lucide-react";
import { TopBanner, Header, Footer } from "@/components/storefront";

export const Route = createFileRoute("/pedido-confirmado")({
  component: OrderConfirmedPage,
});

type ConfirmedOrder = {
  orderId: string;
  paidAt: string;
  total: number;
  itemsTotal: number;
  shipping: { name: string; days: string; price: number } | null;
  items: Array<{ slug: string; title: string; img: string; price: string; qty: number; size?: string }>;
  customer: { name: string; email: string; cpf: string; phone: string };
  address: {
    cep: string; street: string; number: string; complement: string;
    neighborhood: string; city: string; uf: string;
  };
  transactionId?: string;
};

const STORAGE_KEY = "ppl:last-order";

function OrderConfirmedPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && !order) {
      const t = setTimeout(() => navigate({ to: "/" }), 2500);
      return () => clearTimeout(t);
    }
  }, [loaded, order, navigate]);

  const brl = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

  if (!loaded) return null;

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50/50">
        <TopBanner />
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
            Nenhum pedido recente
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Redirecionando para a loja...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const paidDate = new Date(order.paidAt);
  const paidStr = paidDate.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <main className="min-h-screen bg-slate-50/50 text-foreground">
      <TopBanner />
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Hero */}
        <section className="bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-500/5 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 sm:px-10 py-10 text-center">
            <div className="inline-flex w-20 h-20 rounded-full bg-white/15 backdrop-blur items-center justify-center ring-8 ring-white/10">
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="mt-6 text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
              Pagamento confirmado!
            </h1>
            <p className="mt-3 text-sm text-emerald-50 max-w-md mx-auto">
              Recebemos seu PIX e estamos preparando seu pedido. Um e-mail de
              confirmação foi enviado para <strong>{order.customer.email}</strong>.
            </p>
          </div>

          <div className="px-6 sm:px-10 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100">
            <Info label="Pedido" value={`#${order.orderId}`} />
            <Info label="Data" value={paidStr} />
            <Info label="Total pago" value={brl(order.total)} accent />
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Items */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <header className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
              <Package className="w-4 h-4 text-sky-600" />
              <h2 className="text-[11px] font-bold tracking-[0.25em] text-slate-900 uppercase">
                Itens do pedido
              </h2>
            </header>
            <ul className="divide-y divide-slate-100">
              {order.items.map((it, idx) => (
                <li key={`${it.slug}-${idx}`} className="p-6 flex gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 grid place-items-center">
                    <img src={it.img} alt={it.title} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold uppercase text-slate-900 tracking-tight leading-snug line-clamp-2">
                      {it.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                      {it.size ? `Tam: ${it.size} • ` : ""}Qtd: {it.qty}
                    </p>
                    <span className="text-sm font-bold text-sky-600 mt-1 inline-block">
                      R$ {it.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-6 py-5 bg-slate-50/50 space-y-2.5 border-t border-slate-100">
              <Row label="Subtotal" value={brl(order.itemsTotal)} />
              <Row
                label={order.shipping ? `Frete (${order.shipping.name})` : "Frete"}
                value={order.shipping ? brl(order.shipping.price) : "—"}
              />
              <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between items-end">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Total pago
                </span>
                <span className="text-2xl font-black text-emerald-600 tracking-tighter">
                  {brl(order.total)}
                </span>
              </div>
            </div>
          </section>

          {/* Customer + Address */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <header className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <User className="w-4 h-4 text-sky-600" />
                <h2 className="text-[11px] font-bold tracking-[0.25em] text-slate-900 uppercase">
                  Cliente
                </h2>
              </header>
              <div className="p-6 space-y-3 text-sm text-slate-700">
                <p className="font-bold text-slate-900">{order.customer.name}</p>
                <p className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {order.customer.email}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {order.customer.phone}
                </p>
                <p className="flex items-center gap-2 text-xs text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> CPF {order.customer.cpf}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <header className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-sky-600" />
                <h2 className="text-[11px] font-bold tracking-[0.25em] text-slate-900 uppercase">
                  Entrega
                </h2>
              </header>
              <div className="p-6 text-sm text-slate-700 space-y-1.5">
                <p>
                  {order.address.street}, {order.address.number}
                  {order.address.complement ? ` - ${order.address.complement}` : ""}
                </p>
                <p className="text-xs text-slate-500">
                  {order.address.neighborhood} • {order.address.city}/{order.address.uf}
                </p>
                <p className="text-xs text-slate-500">CEP {order.address.cep}</p>
                {order.shipping && (
                  <p className="mt-3 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    {order.shipping.name} — {order.shipping.days}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Next steps */}
        <section className="mt-8 bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-6 sm:p-8">
          <h3 className="text-[11px] font-bold tracking-[0.25em] text-sky-900 uppercase">
            O que acontece agora?
          </h3>
          <ol className="mt-4 space-y-3 text-sm text-slate-700">
            <Step n={1} text="Estamos separando seu pedido no nosso estoque." />
            <Step n={2} text="Você receberá o código de rastreio assim que o pedido for postado." />
            <Step n={3} text={`O produto será entregue no endereço informado em ${order.shipping?.days || "alguns dias"}.`} />
          </ol>
        </section>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" /> Continuar comprando
          </Link>
          <button
            onClick={() => window.print()}
            className="px-8 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2 rounded-xl transition-all"
          >
            Imprimir comprovante
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Info({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">{label}</p>
      <p className={`mt-1 text-sm font-bold ${accent ? "text-emerald-600 text-base" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-slate-900 font-bold">{value}</span>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500 text-white text-[11px] font-black grid place-items-center">
        {n}
      </span>
      <span className="pt-0.5">{text}</span>
    </li>
  );
}

export type { ConfirmedOrder };
export { STORAGE_KEY };
