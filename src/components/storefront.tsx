import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { allProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import logoPpl from "@/assets/logo-ppl-v3.png";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = normalize(q.trim());
    if (!term) return [];
    return allProducts
      .filter((p) => normalize(p.title).includes(term))
      .slice(0, 8);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-16 md:mt-24 max-w-2xl bg-white rounded-md shadow-2xl overflow-hidden mx-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-sky-100">
          <Search className="h-5 w-5 text-sky-700 shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent outline-none text-sm text-sky-900 placeholder:text-slate-400"
          />
          <button onClick={onClose} aria-label="Fechar" className="text-slate-500 hover:text-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!q.trim() && (
            <p className="px-4 py-8 text-center text-xs uppercase tracking-[0.15em] text-slate-400">
              Digite para buscar
            </p>
          )}
          {q.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-xs uppercase tracking-[0.15em] text-slate-400">
              Nenhum produto encontrado
            </p>
          )}
          {results.map((p) => (
            <Link
              key={p.slug}
              to="/produtos/$slug"
              params={{ slug: p.slug }}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-sky-50 border-b border-sky-50 last:border-b-0"
            >
              <img src={p.img} alt={p.title} className="h-14 w-14 object-cover rounded bg-sky-50 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] text-sky-900 truncate">{p.title}</h4>
                <p className="text-sky-700 font-extrabold text-sm">R$ {p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}



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
  { label: "Slides", slug: "slides" },
  { label: "Sneakers", slug: "sneakers" },
  { label: "Perfumes", slug: "perfumes" },
];

export function TopBanner() {
  const [i, setI] = useState(0);
  return (
    <div className="bg-sky-50 border-b border-sky-100">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-2.5 text-[11px] tracking-[0.18em] font-semibold uppercase">
        <button onClick={() => setI((i - 1 + banners.length) % banners.length)} className="text-sky-700/70 hover:text-sky-700">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sky-800">{banners[i]}</span>
        <button onClick={() => setI((i + 1) % banners.length)} className="text-sky-700/70 hover:text-sky-700">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="Início">
      <img
        src={logoPpl}
        alt="PPL Company"
        width={448}
        height={448}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-20 md:h-28 w-auto object-contain drop-shadow-[0_2px_8px_rgba(30,127,255,0.25)]"
      />
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, count } = useCart();
  return (
    <>
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

    <header className="relative bg-sky-400">
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8" onMouseLeave={() => setOpen(null)}>
          {navItems.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setOpen(item.sub ? item.label : null)}>
              <Link
                to="/colecoes/$slug"
                params={{ slug: item.slug }}
                className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:text-white/80 py-2"
              >
                {item.label}
                {item.sub && <ChevronDown className="h-3 w-3" />}
              </Link>
              {item.sub && open === item.label && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-60 pt-2 z-50">
                  <div className="bg-white border border-sky-100 shadow-2xl py-2">
                    {item.sub.map((s) => (
                      <Link
                        key={s.slug}
                        to="/colecoes/$slug"
                        params={{ slug: s.slug }}
                        onClick={() => setOpen(null)}
                        className="block px-5 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-sky-900/80 hover:text-sky-900 hover:bg-sky-50"
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
        <div className="flex items-center gap-5 text-white">
          <button aria-label="Buscar" onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /></button>
          <button aria-label="Conta"><User className="h-5 w-5" /></button>
          <button aria-label="Sacola" className="relative" onClick={openCart}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-white text-sky-700 text-[10px] font-extrabold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="md:hidden max-w-[1400px] mx-auto -mt-2">
        <nav className="px-3 pb-2 flex items-center gap-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) =>
            item.sub ? (
              <button
                key={item.label}
                onClick={() => setOpen(open === item.label ? null : item.label)}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white py-1 shrink-0"
              >
                {item.label}
                <ChevronDown className={`h-3 w-3 transition-transform ${open === item.label ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <Link
                key={item.label}
                to="/colecoes/$slug"
                params={{ slug: item.slug }}
                className="text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:text-white/80 py-1 shrink-0"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        {navItems.map((item) =>
          item.sub && open === item.label ? (
            <div key={item.label} className="bg-white border-t border-sky-100 shadow-inner">
              {item.sub.map((s) => (
                <Link
                  key={s.slug}
                  to="/colecoes/$slug"
                  params={{ slug: s.slug }}
                  onClick={() => setOpen(null)}
                  className="block px-5 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-sky-900/80 hover:text-sky-900 hover:bg-sky-50 border-b border-sky-50 last:border-b-0"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          ) : null
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    </header>
    </>
  );
}


export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/produtos/$slug" params={{ slug: p.slug }} className="group block border border-sky-100 bg-white hover:border-sky-300 hover:shadow-lg transition rounded-md overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-sky-50">
        <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" />
        {p.off && (
          <span className="absolute top-3 right-3 bg-sky-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm">
            🏷 {p.off}
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-sky-900 line-clamp-2 min-h-[2.5rem]">{p.title}</h3>
        <div className="mt-3 flex items-baseline justify-center gap-2">
          <span className="text-sky-700 font-extrabold text-lg">R$ {p.price}</span>
          {p.oldPrice && <span className="text-slate-400 line-through text-xs">R$ {p.oldPrice}</span>}
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-slate-500">
          em até 12x de <span className="text-sky-700 font-bold">R$ {p.installment}</span>
        </p>
      </div>
    </Link>
  );
}

export function Section({ title, items }: { title: string; items: Product[] }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-[0.1em] text-sky-900">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sky-100 mt-16 bg-sky-50">
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <Logo />
          <p className="text-slate-600 mt-4 text-xs leading-relaxed">PPL Company — moda streetwear, sneakers e acessórios direto para sua casa.</p>
        </div>
        <div>
          <h4 className="text-sky-900 font-bold uppercase text-xs tracking-[0.2em] mb-4">Atendimento</h4>
          <ul className="space-y-2 text-slate-600 text-xs"><li>Central de Ajuda</li><li>Trocas e Devoluções</li><li>Rastreio</li><li>Fale Conosco</li></ul>
        </div>
        <div>
          <h4 className="text-sky-900 font-bold uppercase text-xs tracking-[0.2em] mb-4">Institucional</h4>
          <ul className="space-y-2 text-slate-600 text-xs"><li>Sobre nós</li><li>Política de Privacidade</li><li>Termos de Uso</li></ul>
        </div>
        <div>
          <h4 className="text-sky-900 font-bold uppercase text-xs tracking-[0.2em] mb-4">Pagamento</h4>
          <p className="text-slate-600 text-xs">Pix, Cartão de Crédito em até 12x, Boleto.</p>
        </div>
      </div>
      <div className="border-t border-sky-100 py-5 text-center text-[11px] text-slate-500">© {new Date().getFullYear()} PPL Company. Todos os direitos reservados.</div>
    </footer>
  );
}
