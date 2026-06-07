import { createFileRoute } from "@tanstack/react-router";
import { TopBanner, Header, Section, Footer } from "@/components/storefront";
import { featured, kits, tommyProducts, nikeAcademy, bones, caProECaven, outrosSneakers } from "@/lib/products";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "VSN Store — Direto para sua casa" },
      { name: "description", content: "Vestuário, sneakers, acessórios e perfumes com até 12x sem juros." },
    ],
  }),
});

function BannerStrip({ title, subtitle, note }: { title: string; subtitle: string; note?: string }) {
  return (
    <section className="relative max-w-[1400px] mx-auto px-6 py-8">
      <div className="relative overflow-hidden border border-sky-200 bg-gradient-to-br from-sky-300 via-sky-400 to-sky-500 px-8 py-14 md:py-20 rounded-md">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white, transparent 60%)" }} />
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.9]">{title}</h2>
          <p className="mt-4 text-xl md:text-2xl font-bold text-white/95">{subtitle}</p>
          {note && <p className="mt-3 text-sm md:text-base italic text-white/90 font-serif">{note}</p>}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/90 border border-white text-sky-800 px-5 py-2 text-xs font-bold tracking-[0.2em] uppercase">
            🔒 Compra 100% Segura 🔒
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBanner />
      <Header />
      <Section title="Produtos em Destaque" items={featured} />
      <Section title="Kits Completos" items={kits} />
      <Section title="Tommy" items={tommyProducts} />
      <BannerStrip title="Sucesso de Vendas — Lacoste Sport" subtitle="Os bonés mais vendidos da loja" note="somente produtos originais" />
      <Section title="Bonés" items={bones} />
      <BannerStrip title="As Famosas Dri-Fit" subtitle="As mais procuradas Nike Academy" note="as mais procuradas e sucesso de vendas na nossa loja!" />
      <Section title="Nike Academy" items={nikeAcademy} />
      <Section title="CA PRO E CAVEN" items={caProECaven} />
      <Section title="Outros Sneakers" items={outrosSneakers} />
      <Footer />
    </main>
  );
}
