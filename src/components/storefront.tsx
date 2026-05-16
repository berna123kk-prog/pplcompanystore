import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import headerBg from "@/assets/header-bg.png";

const banners = [
  "DIRETO PARA SUA CASA",
  "COMPRA 100% SEGURA",
  "FRETE GRÁTIS ACIMA DE R$ 299",
  "PARCELE EM ATÉ 12X SEM JUROS",
];

const navItems: { label: string; slug: string; sub?: { label: string; slug: string }[] }[] = [
  {
    label: "Vestuário",
    slug: "vestuario",
    sub: [
      { label: "Camisetas", slug: "camisetas" },
      { label: "Jaquetas e Moletons", slug: "jaquetas-e-moletons" },
      { label: "Calças", slug: "calcas" },
      { label: "Bermudas e Shorts", slug: "bermudas-e-shorts" },
      { label: "Kits Completos", slug: "kits-completos" },
    ],
  },
  { label: "Acessórios", slug: "acessorios" },
  {
    label: "Slides",
    slug: "slides",
    sub: [
      { label: "Slides", slug: "slides" },
      { label: "Crocs", slug: "crocs" },
    ],
  },
  { label: "Sneakers", slug: "sneakers" },
  { label: "Perfumes", slug: "perfumes" },
];

export function TopBanner() {
  const [i, setI] = useState(0);
  return (
    <div className="bg-[oklch(0.18_0_0)] border-b border-white/5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-2.5 text-[11px] tracking-[0.18em] font-semibold uppercase">
        <button onClick={() => setI((i - 1 + banners.length) % banners.length)} className="text-white/70 hover:text-white">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-white/90">{banners[i]}</span>
        <button onClick={() => setI((i + 1) % banners.length)} className="text-white/70 hover:text-white">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Logo() {
  return <Link to="/" className="flex items-center" aria-label="Início" />;
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <header
      className="relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${headerBg})` }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8" onMouseLeave={() => setOpen(null)}>
          {navItems.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.sub ? item.label : null)}>
              <Link
                to="/colecoes/$slug"
                params={{ slug: item.slug }}
                className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.15em] text-white/90 hover:text-white py-2"
              >
                {item.label}
                {item.sub && <ChevronDown className="h-3 w-3" />}
              </Link>
              {item.sub && open === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-60 pt-2 z-50">
                  <div className="bg-[oklch(0.16_0_0)] border border-white/10 shadow-2xl py-2">
                    {item.sub.map((s) => (
                      <Link
                        key={s.slug}
                        to="/colecoes/$slug"
                        params={{ slug: s.slug }}
                        onClick={() => setOpen(null)}
                        className="block px-5 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-white/80 hover:text-white hover:bg-white/5"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-white/80">
          <button aria-label="Buscar"><Search className="h-5 w-5" /></button>
          <button aria-label="Conta"><User className="h-5 w-5" /></button>
          <button aria-label="Sacola" className="relative">
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
      </div>
    </header>
  );
}

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/produtos/$slug" params={{ slug: p.slug }} className="group block border border-white/10 bg-[oklch(0.15_0_0)] hover:border-white/30 transition">
      <div className="relative aspect-square overflow-hidden bg-white">
        <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" />
        {p.off && (
          <span className="absolute top-3 right-3 bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
            🏷 {p.off}
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/90 line-clamp-2 min-h-[2.5rem]">{p.title}</h3>
        <div className="mt-3 flex items-baseline justify-center gap-2">
          <span className="text-white font-extrabold text-lg">R$ {p.price}</span>
          {p.oldPrice && <span className="text-white/40 line-through text-xs">R$ {p.oldPrice}</span>}
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/60">
          em até 12x de <span className="text-white font-bold">R$ {p.installment}</span>
        </p>
      </div>
    </Link>
  );
}

export function Section({ title, items }: { title: string; items: Product[] }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-[0.1em] text-white">{title}</h2>
        <a href="#" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white">Ver mais</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <Logo />
          <p className="text-white/60 mt-4 text-xs leading-relaxed">VSN Store — moda streetwear, sneakers e acessórios direto para sua casa.</p>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] mb-4">Atendimento</h4>
          <ul className="space-y-2 text-white/60 text-xs"><li>Central de Ajuda</li><li>Trocas e Devoluções</li><li>Rastreio</li><li>Fale Conosco</li></ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] mb-4">Institucional</h4>
          <ul className="space-y-2 text-white/60 text-xs"><li>Sobre nós</li><li>Política de Privacidade</li><li>Termos de Uso</li></ul>
        </div>
        <div>
          <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em] mb-4">Pagamento</h4>
          <p className="text-white/60 text-xs">Pix, Cartão de Crédito em até 12x, Boleto.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[11px] text-white/40">© {new Date().getFullYear()} VSN Store. Todos os direitos reservados.</div>
    </footer>
  );
}
