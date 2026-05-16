import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Minus, Plus, Truck, ShieldCheck, RefreshCw, Headphones, Package } from "lucide-react";
import { useState } from "react";
import { TopBanner, Header, Footer, Section } from "@/components/storefront";
import { getProduct, products, SHOE_SIZES, CLOTHING_SIZES, type Product } from "@/lib/products";

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <main className="min-h-screen bg-background text-foreground grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-blue-500 underline">Voltar para a loja</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <main className="min-h-screen bg-background text-foreground grid place-items-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-xl font-bold">Erro ao carregar o produto</h1>
          <p className="text-white/60 text-sm mt-2">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 bg-blue-600 px-5 py-2 text-sm font-bold uppercase">
            Tentar novamente
          </button>
        </div>
      </main>
    );
  },
});

function SizeGrid({ sizes, value, onChange }: { sizes: string[]; value: string; onChange: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const active = s === value;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`min-w-[44px] h-11 px-3 text-[11px] font-bold uppercase border rounded-sm transition ${
              active ? "bg-white text-black border-white" : "bg-transparent text-white/80 border-white/25 hover:border-white/60"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

function SizeSelector({ product }: { product: Product }) {
  const showShoe = product.kind === "footwear" || product.kind === "kit";
  const showClothing = product.kind === "clothing" || product.kind === "kit";

  const [shoe, setShoe] = useState(showShoe ? "34" : "");
  const [clothing, setClothing] = useState(showClothing ? "M" : "");

  if (product.kind === "accessory") return null;

  return (
    <div className="space-y-5">
      {showClothing && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 mb-3">
            Tamanho da roupa: <span className="text-white">{clothing}</span>
          </p>
          <SizeGrid sizes={CLOTHING_SIZES} value={clothing} onChange={setClothing} />
        </div>
      )}
      {showShoe && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 mb-3">
            {product.kind === "kit" ? "Tamanho do calçado" : "Tamanho"}: <span className="text-white">{shoe}</span>
          </p>
          <SizeGrid sizes={SHOE_SIZES} value={shoe} onChange={setShoe} />
        </div>
      )}
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");

  const stock = product.stock ?? 10;
  const stockPct = Math.max(10, Math.min(100, (stock / 30) * 100));

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 6);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBanner />
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 pt-6 text-[11px] uppercase tracking-[0.15em] font-bold text-white/60">
        <Link to="/" className="hover:text-white">Home</Link>
        <span className="mx-2 text-white/30">›</span>
        <span className="text-white">{product.title}</span>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 py-8 grid lg:grid-cols-2 gap-10">
        <div className="border border-white/10 bg-white">
          <img src={product.img} alt={product.title} className="w-full aspect-square object-cover" />
        </div>

        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] font-bold">
            {product.sold && <span className="text-white/60">{product.sold.toLocaleString("pt-BR")} vendidos</span>}
            <span className="border border-white/30 px-2 py-1 text-white/90">Itens Oficiais</span>
          </div>

          <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-white">{product.title}</h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white">R$ {product.price}</span>
            {product.oldPrice && <span className="text-white/40 line-through text-sm">R$ {product.oldPrice}</span>}
            {product.off && <span className="bg-black border border-white/20 text-white text-[10px] font-bold px-2 py-1">🏷 {product.off}</span>}
          </div>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/70">
            em até 12x de <span className="text-white font-bold">R$ {product.installment}</span>
          </p>

          <div className="mt-7">
            <SizeSelector product={product} />
          </div>

          {product.kind !== "accessory" && (
            <div className="mt-6">
              <p className="text-center text-[11px] uppercase tracking-[0.15em] text-white/70">
                Restam apenas <span className="text-red-500 font-extrabold">{stock}</span> unidades desse produto
              </p>
              <div className="mt-2 h-1.5 bg-white/10 rounded">
                <div className="h-full bg-blue-600 rounded" style={{ width: `${stockPct}%` }} />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-stretch gap-3">
            <div className="flex items-center border border-white/20">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 h-12 text-white/80 hover:text-white"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 h-12 text-white/80 hover:text-white"><Plus className="h-4 w-4" /></button>
            </div>
            <button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold uppercase tracking-[0.15em]">
              Adicionar ao carrinho
            </button>
          </div>

          <div className="mt-6 border border-white/10 p-4">
            <p className="text-center text-[11px] uppercase tracking-[0.15em] text-white/70 mb-3">
              Calcule o envio e prazo de entrega
            </p>
            <div className="flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP"
                className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
              />
              <button className="bg-black border border-white/20 px-5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                Calcular
              </button>
            </div>
          </div>

          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {[
              { icon: Headphones, label: "Suporte personalizado" },
              { icon: Package, label: "Informações do envio" },
              { icon: RefreshCw, label: "Trocas e devoluções" },
              { icon: ShieldCheck, label: "Compra 100% segura" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 py-4 text-sm text-white/90">
                <Icon className="h-4 w-4 text-white/70" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-10 border-t border-white/10 mt-6">
        <div className="flex items-center justify-center gap-4 text-white/80">
          <Truck className="h-7 w-7" />
          <div>
            <p className="text-xl font-extrabold text-white">Entrega Garantida</p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-white/60">Receba no prazo ou seu dinheiro de volta.</p>
          </div>
        </div>
      </div>

      <Section title="Produtos Relacionados" items={related} />
      <Footer />
    </main>
  );
}
