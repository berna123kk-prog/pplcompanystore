import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Loader2, ArrowLeft, Pencil, Lock, Tag, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { TopBanner, Header, Footer } from "@/components/storefront";
import { useCart } from "@/lib/cart";
import { createDeposit, checkTransaction, type DepositResult } from "@/lib/elitepay.functions";
import { getShippingOptions, type ShippingOption } from "@/lib/shipping.functions";
import { findCoupon, calcDiscount, FIRST_PURCHASE_FLAG, type Coupon } from "@/lib/coupons";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

// ---------- helpers ----------
const onlyDigits = (s: string) => s.replace(/\D+/g, "");
const formatCpf = (s: string) =>
  onlyDigits(s).slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
const formatPhone = (s: string) => {
  const d = onlyDigits(s).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => `(${a}) ${b}${c ? "-" + c : ""}`).trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, (_, a, b, c) => `(${a}) ${b}${c ? "-" + c : ""}`).trim();
};
const formatCep = (s: string) => onlyDigits(s).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

type Customer = { name: string; email: string; cpf: string; phone: string };
type Address = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
};

// ---------- step card chrome ----------
function StepCard({
  n, title, done, active, onEdit, children,
}: {
  n: number; title: string; done: boolean; active: boolean;
  onEdit?: () => void; children: React.ReactNode;
}) {
  const activeChrome = active
    ? "bg-white border-2 border-sky-500 shadow-lg shadow-sky-500/10"
    : done
      ? "bg-white border border-slate-200"
      : "bg-slate-50/60 border border-slate-100 opacity-60";
  return (
    <section className={`rounded-2xl overflow-hidden transition-all duration-300 ${activeChrome}`}>
      <header className="px-6 sm:px-8 py-5 flex items-center gap-4 border-b border-slate-100">
        <span
          className={`flex-shrink-0 w-10 h-10 grid place-items-center font-bold text-base rounded-lg ${
            done
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : active
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                : "bg-slate-200 text-slate-500"
          }`}
        >
          {done ? <Check className="h-5 w-5 stroke-[3]" /> : n}
        </span>
        <h2
          className={`text-sm font-bold tracking-[0.25em] uppercase ${
            active || done ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {title}
        </h2>
        {done && onEdit && (
          <button
            onClick={onEdit}
            className="ml-auto text-slate-400 hover:text-sky-600 transition-colors"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </header>
      {(active || done) ? (
        <div className="p-6 sm:p-8">{children}</div>
      ) : (
        <div className="px-6 sm:px-8 pb-5 -mt-1 text-xs text-slate-400">{children}</div>
      )}
    </section>
  );
}

const inputCls =
  "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 focus:bg-white transition-all";
const labelCls =
  "block text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-2";
const primaryBtn =
  "w-full md:w-auto px-12 py-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2 rounded-xl shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all";

// ---------- main ----------
function CheckoutPage() {
  const { items, total: itemsTotal, count, clear } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [shipping, setShipping] = useState<ShippingOption | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isFirstPurchase, setIsFirstPurchase] = useState(false);

  // Detecta primeira compra e aplica PRIMEIRA20 automaticamente
  useEffect(() => {
    try {
      const purchased = localStorage.getItem(FIRST_PURCHASE_FLAG);
      if (!purchased) {
        setIsFirstPurchase(true);
        const c = findCoupon("PRIMEIRA20");
        if (c) setCoupon(c);
      }
    } catch {}
  }, []);

  const discount = useMemo(
    () => (coupon ? calcDiscount(coupon, itemsTotal) : 0),
    [coupon, itemsTotal],
  );
  const shippingCost = shipping ? (coupon?.freeShipping ? 0 : shipping.price) : 0;
  const grandTotal = Math.max(0, itemsTotal - discount) + shippingCost;

  return (
    <main className="min-h-screen bg-slate-50/50 text-foreground">
      <TopBanner />
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Continuar comprando
        </Link>

        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tighter text-slate-900 uppercase">
          Finalizar compra
        </h1>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <StepIdentify
              step={step}
              customer={customer}
              onEdit={() => setStep(1)}
              onContinue={(c) => { setCustomer(c); setStep(2); }}
            />
            <StepDelivery
              step={step}
              address={address}
              shipping={shipping}
              itemsCount={count}
              onEdit={() => setStep(2)}
              onContinue={(addr, ship) => { setAddress(addr); setShipping(ship); setStep(3); }}
            />
            <StepPayment
              step={step}
              items={items}
              customer={customer}
              address={address}
              shipping={shipping}
              itemsTotal={itemsTotal}
              total={grandTotal}
              coupon={coupon}
              discount={discount}
              onPaid={(transactionId) => {
                try {
                  const order = {
                    orderId: (transactionId || Date.now().toString()).slice(-8).toUpperCase(),
                    paidAt: new Date().toISOString(),
                    total: grandTotal,
                    itemsTotal,
                    discount,
                    coupon: coupon ? { code: coupon.code, label: coupon.label } : null,
                    shipping: shipping ? { name: shipping.name, days: shipping.days, price: shippingCost } : null,
                    items: items.map((i) => ({ slug: i.slug, title: i.title, img: i.img, price: i.price, qty: i.qty, size: i.size })),
                    customer: customer!,
                    address: address!,
                    transactionId,
                  };
                  sessionStorage.setItem("ppl:last-order", JSON.stringify(order));
                  localStorage.setItem(FIRST_PURCHASE_FLAG, "1");
                } catch {}
                clear();
                navigate({ to: "/pedido-confirmado" });
              }}
            />
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <OrderSummary
              items={items}
              itemsTotal={itemsTotal}
              shipping={shipping}
              total={grandTotal}
              count={count}
              coupon={coupon}
              discount={discount}
              isFirstPurchase={isFirstPurchase}
              onApplyCoupon={(code) => {
                const c = findCoupon(code);
                if (!c) {
                  toast.error("Cupom inválido");
                  return false;
                }
                if (c.firstPurchaseOnly && !isFirstPurchase) {
                  toast.error("Este cupom é apenas para a primeira compra");
                  return false;
                }
                setCoupon(c);
                toast.success(`Cupom ${c.code} aplicado!`);
                return true;
              }}
              onRemoveCoupon={() => setCoupon(null)}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// ---------- Step 1 ----------
function StepIdentify({
  step, customer, onContinue, onEdit,
}: {
  step: 1 | 2 | 3;
  customer: Customer | null;
  onContinue: (c: Customer) => void;
  onEdit: () => void;
}) {
  const done = step > 1;
  const active = step === 1;
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [cpf, setCpf] = useState(customer?.cpf ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");

  useEffect(() => {
    if (customer) {
      setName(customer.name); setEmail(customer.email);
      setCpf(customer.cpf); setPhone(customer.phone);
    }
  }, [customer]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Informe seu nome completo");
    if (!isEmail(email)) return toast.error("E-mail inválido");
    if (onlyDigits(cpf).length !== 11) return toast.error("CPF inválido");
    if (onlyDigits(phone).length < 10) return toast.error("Celular inválido");
    onContinue({ name: name.trim(), email: email.trim(), cpf, phone });
  };

  return (
    <StepCard n={1} title="Identifique-se" done={done} active={active} onEdit={onEdit}>
      {done && !active ? (
        <div className="text-sm text-slate-700 space-y-1">
          <p className="font-bold">{customer?.name}</p>
          <p>{customer?.email}</p>
          <p>CPF {customer?.cpf}</p>
        </div>
      ) : active ? (
        <form onSubmit={submit} className="space-y-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            Utilizaremos seu e-mail para identificar seu perfil, histórico de compra e notificação de pedidos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="md:col-span-2">
              <label className={labelCls}>Nome completo</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Insira seu nome" required />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>E-mail</label>
              <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
            </div>
            <div>
              <label className={labelCls}>CPF</label>
              <input className={inputCls} value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" required />
            </div>
            <div>
              <label className={labelCls}>Celular / WhatsApp</label>
              <input className={inputCls} value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(00) 00000-0000" inputMode="tel" required />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className={primaryBtn}>Continuar →</button>
          </div>
        </form>
      ) : (
        <span>Preencha suas informações pessoais para continuar</span>
      )}
    </StepCard>
  );
}

// ---------- Step 2 ----------
function StepDelivery({
  step, address, shipping, itemsCount, onContinue, onEdit,
}: {
  step: 1 | 2 | 3;
  address: Address | null;
  shipping: ShippingOption | null;
  itemsCount: number;
  onContinue: (a: Address, s: ShippingOption) => void;
  onEdit: () => void;
}) {
  const done = step > 2;
  const active = step === 2;
  const enabled = step >= 2;

  const [cep, setCep] = useState(address?.cep ?? "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [number, setNumber] = useState(address?.number ?? "");
  const [complement, setComplement] = useState(address?.complement ?? "");
  const [neighborhood, setNeighborhood] = useState(address?.neighborhood ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [uf, setUf] = useState(address?.uf ?? "");
  const [cepLoading, setCepLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selected, setSelected] = useState<ShippingOption | null>(shipping);
  const [shipLoading, setShipLoading] = useState(false);
  const lastCep = useRef<string>("");

  useEffect(() => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8 || digits === lastCep.current) return;
    lastCep.current = digits;
    (async () => {
      setCepLoading(true);
      setShipLoading(true);
      try {
        const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        if (r.ok) {
          const j = await r.json();
          if (!j.erro) {
            setStreet(j.logradouro || "");
            setNeighborhood(j.bairro || "");
            setCity(j.localidade || "");
            setUf(j.uf || "");
          } else {
            toast.error("CEP não encontrado");
          }
        }
      } catch {
        toast.error("Falha ao buscar CEP");
      } finally {
        setCepLoading(false);
      }
      try {
        const res = await getShippingOptions({ data: { cep: digits, itemsCount: Math.max(1, itemsCount) } });
        setOptions(res.options);
        if (!selected) setSelected(res.options[0]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao calcular frete");
      } finally {
        setShipLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep, itemsCount]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onlyDigits(cep).length !== 8) return toast.error("Informe um CEP válido");
    if (!street || !number || !city || !uf) return toast.error("Preencha o endereço completo");
    if (!selected) return toast.error("Selecione uma opção de entrega");
    onContinue({ cep, street, number, complement, neighborhood, city, uf }, selected);
  };

  return (
    <StepCard n={2} title="Entrega" done={done} active={active} onEdit={onEdit}>
      {!enabled ? (
        <span>Conclua a identificação para continuar</span>
      ) : done && !active ? (
        <div className="text-sm text-slate-700 space-y-1">
          <p>{address?.street}, {address?.number}{address?.complement ? ` - ${address.complement}` : ""}</p>
          <p>{address?.neighborhood} • {address?.city}/{address?.uf} • CEP {address?.cep}</p>
          <p className="text-xs text-slate-500 mt-2">{shipping?.name} — {shipping?.days} — R$ {shipping?.price.toFixed(2).replace(".", ",")}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>CEP</label>
              <div className="relative">
                <input className={inputCls} value={cep} onChange={(e) => setCep(formatCep(e.target.value))} placeholder="00000-000" inputMode="numeric" required />
                {cepLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-sky-700" />}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Rua</label>
              <input className={inputCls} value={street} onChange={(e) => setStreet(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Número</label>
              <input className={inputCls} value={number} onChange={(e) => setNumber(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Complemento</label>
              <input className={inputCls} value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Opcional" />
            </div>
            <div>
              <label className={labelCls}>Bairro</label>
              <input className={inputCls} value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Cidade</label>
              <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>UF</label>
              <input className={inputCls} value={uf} onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))} maxLength={2} required />
            </div>
          </div>

          <div className="pt-2">
            <p className={labelCls}>Escolha uma forma de entrega:</p>
            {shipLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Calculando frete...</div>
            ) : options.length === 0 ? (
              <p className="text-xs text-slate-500">Informe o CEP para ver as opções.</p>
            ) : (
              <div className="space-y-2">
                {options.map((opt) => {
                  const isSel = selected?.id === opt.id;
                  return (
                    <label key={opt.id} className={`flex items-center gap-3 border-2 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${isSel ? "border-sky-500 bg-sky-50/50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="radio" name="ship" checked={isSel} onChange={() => setSelected(opt)} className="accent-sky-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-900">{opt.name}</p>
                          {opt.badge === "FULL" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
                              FULL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.days}</p>
                      </div>
                      <p className="text-sm font-extrabold text-sky-900">R$ {opt.price.toFixed(2).replace(".", ",")}</p>
                    </label>
                  );
                })}
                <p className="text-[10px] text-slate-400 mt-1">* Valores estimados com base na sua região.</p>
              </div>
            )}
          </div>

          <button type="submit" className={primaryBtn}>Continuar →</button>
        </form>
      )}
    </StepCard>
  );
}

// ---------- Step 3 ----------
function StepPayment({
  step, items, customer, address, shipping, itemsTotal, total, coupon, discount, onPaid,
}: {
  step: 1 | 2 | 3;
  items: ReturnType<typeof useCart>["items"];
  customer: Customer | null;
  address: Address | null;
  shipping: ShippingOption | null;
  itemsTotal: number;
  total: number;
  coupon: Coupon | null;
  discount: number;
  onPaid: (transactionId?: string) => void;
}) {
  const done = step > 3;
  const active = step === 3;
  const enabled = step >= 3;

  const [loading, setLoading] = useState(false);
  const [pix, setPix] = useState<DepositResult | null>(null);
  const [status, setStatus] = useState<string>("PENDING");
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

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
          onPaid(pix.transactionId);
        }
      } catch {}
    }, 4000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [pix?.transactionId, onPaid]);

  const generate = async () => {
    if (!customer) return toast.error("Preencha seus dados primeiro");
    if (items.length === 0) return toast.error("Sua sacola está vazia");
    setLoading(true);
    try {
      const result = await createDeposit({
        data: {
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          payerName: customer.name,
          payerDocument: onlyDigits(customer.cpf),
          shippingAmount: coupon?.freeShipping ? 0 : (shipping?.price ?? 0),
          couponCode: coupon?.code,
        },
      });
      if (!result.qrCode && !result.qrCodeImage) throw new Error("Gateway não retornou o código PIX.");
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
    } catch {}
  };

  return (
    <StepCard n={3} title="Pagamento" done={done} active={active}>
      {!enabled ? (
        <span>Preencha suas informações pessoais para continuar</span>
      ) : !pix ? (
        <div className="space-y-5">
          <div className="border-2 border-sky-500 bg-sky-50/40 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <input type="radio" checked readOnly className="accent-sky-500 h-4 w-4" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pix</span>
              <span className="ml-auto text-[9px] font-bold uppercase tracking-[0.15em] bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                Instantâneo
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              A confirmação é realizada em poucos minutos. Use o app do seu banco para pagar.
            </p>
            <p className="mt-4 text-lg font-black text-emerald-600 tracking-tight">
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button onClick={generate} disabled={loading} className="w-full md:w-auto px-12 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-[0.25em] inline-flex items-center justify-center gap-2 rounded-xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? "Gerando PIX..." : "Finalizar agora"}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-extrabold text-sky-900">R$ {total.toFixed(2).replace(".", ",")}</p>
          <div className="mt-4 inline-block p-3 border border-sky-200">
            {pix.qrCodeImage ? (
              <img
                src={pix.qrCodeImage.startsWith("data:") ? pix.qrCodeImage : `data:image/png;base64,${pix.qrCodeImage}`}
                alt="QR Code PIX"
                className="w-[220px] h-[220px] object-contain"
              />
            ) : pix.qrCode ? (
              <QRCodeSVG value={pix.qrCode} size={220} level="M" />
            ) : null}
          </div>
          {pix.qrCode && (
            <div className="mt-4 text-left">
              <p className={labelCls}>PIX Copia e Cola</p>
              <div className="flex gap-2">
                <input readOnly value={pix.qrCode} className="flex-1 border border-sky-200 px-3 py-2 text-xs text-sky-900 bg-sky-50 truncate" />
                <button onClick={copyPix} className="px-4 bg-sky-900 hover:bg-sky-800 text-white text-[11px] font-bold uppercase inline-flex items-center gap-1">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-bold text-sky-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Aguardando pagamento... ({status})
          </div>
        </div>
      )}
    </StepCard>
  );
}

// ---------- Order summary ----------
function OrderSummary({
  items, itemsTotal, shipping, total, count, coupon, discount, isFirstPurchase, onApplyCoupon, onRemoveCoupon,
}: {
  items: ReturnType<typeof useCart>["items"];
  itemsTotal: number;
  shipping: ShippingOption | null;
  total: number;
  count: number;
  coupon: Coupon | null;
  discount: number;
  isFirstPurchase: boolean;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    const ok = onApplyCoupon(code);
    if (ok) {
      setCode("");
      setOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <aside className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[11px] font-bold tracking-[0.25em] text-slate-900 uppercase">
            Resumo do pedido
          </h2>
          {count > 0 && (
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {count} {count === 1 ? "item" : "itens"}
            </span>
          )}
        </header>

        <div className="p-6">
          {items.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400 uppercase tracking-widest font-bold">
              Sacola vazia
            </p>
          ) : (
            <ul className="space-y-5 max-h-72 overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <li key={`${it.slug}-${idx}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 grid place-items-center">
                    <img src={it.img} alt={it.title} className="h-full w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-xs font-bold uppercase text-slate-900 tracking-tight leading-snug line-clamp-2">
                      {it.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                      {it.size ? `Tam: ${it.size} • ` : ""}Qtd: {it.qty}
                    </p>
                    <span className="text-sm font-bold text-sky-600 mt-1">
                      R$ {it.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Banner primeira compra */}
          {isFirstPurchase && items.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white relative overflow-hidden">
              <Sparkles className="absolute -right-2 -top-2 h-16 w-16 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">
                Promoção primeira compra
              </p>
              <p className="text-sm font-extrabold mt-1">
                20% OFF com o cupom <span className="font-mono">PRIMEIRA20</span>
              </p>
              <p className="text-[11px] opacity-90 mt-0.5">
                {coupon?.code === "PRIMEIRA20"
                  ? "Cupom aplicado automaticamente 🎉"
                  : "Aplique no campo abaixo para garantir o desconto."}
              </p>
            </div>
          )}

          {/* Cupom */}
          {items.length > 0 && (
            <div className="mt-5">
              {coupon ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50">
                  <Tag className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider truncate">
                      {coupon.code}
                    </p>
                    <p className="text-[10px] text-emerald-600/80 truncate">{coupon.label}</p>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-emerald-600 hover:text-emerald-800"
                    aria-label="Remover cupom"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : open ? (
                <div className="space-y-2">
                  <label className={labelCls}>Código do cupom</label>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
                      placeholder="Ex.: PRIMEIRA20"
                      className={inputCls}
                      maxLength={40}
                    />
                    <button
                      onClick={handleApply}
                      className="px-4 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-sky-400 hover:bg-sky-50 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600 hover:text-sky-700 transition-colors"
                >
                  <Tag className="h-3.5 w-3.5" />
                  Inserir cupom de desconto
                </button>
              )}
            </div>
          )}

          <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-slate-900 font-bold">
                R$ {itemsTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600 font-bold">
                  Desconto {coupon ? `(${coupon.code})` : ""}
                </span>
                <span className="text-emerald-600 font-bold">
                  − R$ {discount.toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-medium">Frete</span>
              <span className="text-slate-900 font-bold">
                {shipping
                  ? coupon?.freeShipping
                    ? <span className="text-emerald-600">Grátis</span>
                    : `R$ ${shipping.price.toFixed(2).replace(".", ",")}`
                  : "—"}
              </span>
            </div>
            <div className="pt-5 mt-2 border-t border-slate-100 flex justify-between items-end">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Total
              </span>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <p className="text-[10px] text-sky-700 font-bold uppercase tracking-[0.15em]">
                Pague com PIX e receba mais rápido
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-center gap-4 text-slate-400">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          <span className="text-[9px] font-bold tracking-widest uppercase">SSL Seguro</span>
        </div>
        <span className="w-px h-3 bg-slate-200" />
        <span className="text-[9px] font-bold tracking-widest uppercase">PPL Company Verified</span>
      </div>
    </div>
  );
}

