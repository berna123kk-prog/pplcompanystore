import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Minus, Plus, Truck, ShieldCheck, RefreshCw, Headphones, Package, ChevronLeft, ChevronRight, Pencil, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TopBanner, Header, Footer, Section } from "@/components/storefront";
import { getProduct, products, SHOE_SIZES, CLOTHING_SIZES, type Product, type ProductColor } from "@/lib/products";
import { SIZE_LABELS } from "@/lib/size-labels";
import { useCart } from "@/lib/cart";
import { getSizeOverrides, getMyRole, setSoldOutSizes } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


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
          <p className="text-slate-500 text-sm mt-2">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 bg-blue-600 px-5 py-2 text-sm font-bold uppercase">
            Tentar novamente
          </button>
        </div>
      </main>
    );
  },
});

function SizeGrid({
  sizes,
  value,
  onChange,
  soldOut = [],
  editMode = false,
  onToggleSoldOut,
}: {
  sizes: string[];
  value: string;
  onChange: (s: string) => void;
  soldOut?: string[];
  editMode?: boolean;
  onToggleSoldOut?: (s: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const active = s === value;
        const isSoldOut = soldOut.includes(s);

        if (editMode) {
          return (
            <button
              key={s}
              type="button"
              onClick={() => onToggleSoldOut?.(s)}
              title={isSoldOut ? "Clique para marcar como disponível" : "Clique para marcar como esgotado"}
              className={`min-w-[44px] h-11 px-3 text-[11px] font-bold uppercase border-2 rounded-sm transition ${
                isSoldOut
                  ? "line-through text-slate-400 border-red-300 bg-red-50"
                  : "text-sky-900 border-emerald-400 bg-emerald-50 hover:border-emerald-600"
              }`}
            >
              {s}
            </button>
          );
        }

        if (isSoldOut) {
          return (
            <button
              key={s}
              type="button"
              disabled
              aria-disabled="true"
              title="Esgotado"
              className="min-w-[44px] h-11 px-3 text-[11px] font-bold uppercase border rounded-sm line-through text-slate-400 border-slate-200 bg-slate-100/50 cursor-not-allowed"
            >
              {s}
            </button>
          );
        }
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`min-w-[44px] h-11 px-3 text-[11px] font-bold uppercase border rounded-sm transition ${
              active ? "bg-white text-black border-white" : "bg-transparent text-sky-900/80 border-sky-200 hover:border-sky-500"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}


function SizeSelector({
  product,
  shoe,
  setShoe,
  clothing,
  setClothing,
  soldOut,
  editMode,
  onToggleSoldOut,
}: {
  product: Product;
  shoe: string;
  setShoe: (s: string) => void;
  clothing: string;
  setClothing: (s: string) => void;
  soldOut: string[];
  editMode: boolean;
  onToggleSoldOut: (s: string) => void;
}) {
  const showShoe = product.kind === "footwear" || product.kind === "kit";
  const showClothing = product.kind === "clothing" || product.kind === "kit";

  if (product.kind === "accessory") return null;

  return (
    <div className="space-y-5">
      {showClothing && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-700 mb-3">
            {product.kind === "kit" ? SIZE_LABELS.kitClothing : SIZE_LABELS.clothing}: <span className="text-sky-900">{clothing}</span>
          </p>
          <SizeGrid sizes={CLOTHING_SIZES} value={clothing} onChange={setClothing} soldOut={soldOut} editMode={editMode} onToggleSoldOut={onToggleSoldOut} />
        </div>
      )}
      {showShoe && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-700 mb-3">
            {product.kind === "kit" ? SIZE_LABELS.kitFootwear : SIZE_LABELS.footwear}: <span className="text-sky-900">{shoe}</span>
          </p>
          <SizeGrid sizes={SHOE_SIZES} value={shoe} onChange={setShoe} soldOut={soldOut} editMode={editMode} onToggleSoldOut={onToggleSoldOut} />
        </div>
      )}
    </div>
  );
}


function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const showShoe = product.kind === "footwear" || product.kind === "kit";
  const showClothing = product.kind === "clothing" || product.kind === "kit";
  // Admin / size overrides
  const queryClient = useQueryClient();
  const getOverridesFn = useServerFn(getSizeOverrides);
  const getMyRoleFn = useServerFn(getMyRole);
  const setSoldOutFn = useServerFn(setSoldOutSizes);

  const overridesQuery = useQuery({
    queryKey: ["size-overrides"],
    queryFn: () => getOverridesFn(),
    staleTime: 30_000,
  });

  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setHasSession(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const roleQuery = useQuery({
    queryKey: ["my-role", hasSession],
    queryFn: () => getMyRoleFn(),
    enabled: hasSession,
    staleTime: 60_000,
  });
  const isAdmin = roleQuery.data?.isAdmin ?? false;

  const remoteSoldOut = overridesQuery.data?.overrides?.[product.slug];
  const soldOutSizes = useMemo(
    () => remoteSoldOut ?? product.soldOutSizes ?? [],
    [remoteSoldOut, product.soldOutSizes],
  );

  const [editMode, setEditMode] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (sizes: string[]) => setSoldOutFn({ data: { slug: product.slug, sizes } }),
    onMutate: async (sizes) => {
      await queryClient.cancelQueries({ queryKey: ["size-overrides"] });
      const prev = queryClient.getQueryData<{ overrides: Record<string, string[]> }>(["size-overrides"]);
      queryClient.setQueryData(["size-overrides"], (old: { overrides: Record<string, string[]> } | undefined) => ({
        overrides: { ...(old?.overrides ?? {}), [product.slug]: sizes },
      }));
      return { prev };
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["size-overrides"], ctx.prev);
      toast.error(err.message || "Erro ao salvar");
    },
    onSuccess: () => toast.success("Salvo", { duration: 1500 }),
  });

  const handleToggleSoldOut = useCallback(
    (size: string) => {
      const current = soldOutSizes;
      const next = current.includes(size) ? current.filter((s: string) => s !== size) : [...current, size];
      saveMutation.mutate(next);
    },
    [soldOutSizes, saveMutation],
  );

  const pickDefault = (list: string[], preferred: string) =>
    !soldOutSizes.includes(preferred) ? preferred : (list.find((s) => !soldOutSizes.includes(s)) ?? preferred);
  const [shoe, setShoe] = useState(showShoe ? pickDefault(SHOE_SIZES, "38") : "");
  const [clothing, setClothing] = useState(showClothing ? pickDefault(CLOTHING_SIZES, "M") : "");
  const gallery = product.images && product.images.length > 0 ? product.images : [product.img];
  const [imgIdx, setImgIdx] = useState(0);
  const currentImage = gallery[imgIdx] ?? gallery[0] ?? product.img;
  const hasMultiple = gallery.length > 1;
  const prev = () => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setImgIdx((i) => (i + 1) % gallery.length);

  const colors: ProductColor[] = product.colors ?? [];
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const activeColor =
    colors.find((c) => c.name === selectedColorName) ??
    colors.find((c) => c.img === currentImage) ??
    colors[0];

  useEffect(() => {
    setImgIdx(0);
    setSelectedColorName(null);
  }, [product.slug]);

  useEffect(() => {
    setImgIdx((i) => (gallery.length === 0 ? 0 : Math.min(i, gallery.length - 1)));
  }, [gallery.length]);

  const stock = product.stock ?? 10;
  const stockPct = Math.max(10, Math.min(100, (stock / 30) * 100));

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 6);

  const handleAddToCart = () => {
    const sizeParts = [
      showClothing ? clothing : "",
      showShoe ? shoe : "",
      activeColor?.name ?? "",
    ].filter(Boolean);
    addItem(
      {
        slug: product.slug,
        title: product.title,
        price: product.price,
        img: currentImage,
        size: sizeParts.join(" / ") || undefined,
      },
      qty,
    );
    toast.success("Produto adicionado à sacola");
  };


  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBanner />
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 pt-6 text-[11px] uppercase tracking-[0.15em] font-bold text-slate-500">
        <Link to="/" className="hover:text-sky-900">Home</Link>
        <span className="mx-2 text-slate-300">›</span>
        <span className="text-sky-900">{product.title}</span>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 py-8 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="relative border border-sky-100 bg-white group">
            <img key={`${product.slug}-${imgIdx}`} src={currentImage} alt={product.title} className="w-full h-auto object-contain bg-white block" />
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Imagem anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 grid place-items-center rounded-full bg-white/90 border border-sky-200 text-sky-900 hover:bg-white shadow cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próxima imagem"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 grid place-items-center rounded-full bg-white/90 border border-sky-200 text-sky-900 hover:bg-white shadow cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {hasMultiple && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {gallery.map((src: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  className={`h-20 w-20 border bg-white overflow-hidden transition-all ${i === imgIdx ? "border-sky-900 ring-2 ring-sky-900" : "border-sky-100 hover:border-sky-300"}`}
                >
                  <img src={src} alt={`${product.title} ${i + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] font-bold">
            {product.sold && <span className="text-slate-500">{product.sold.toLocaleString("pt-BR")} vendidos</span>}
            <span className="border border-sky-300 px-2 py-1 text-sky-900/90">Itens Oficiais</span>
          </div>

          <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-sky-900">{product.title}</h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-sky-900">R$ {product.price}</span>
            {product.oldPrice && <span className="text-slate-400 line-through text-sm">R$ {product.oldPrice}</span>}
            {product.off && <span className="bg-sky-700 border border-sky-200 text-sky-900 text-[10px] font-bold px-2 py-1">🏷 {product.off}</span>}
          </div>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-sky-700">
            em até 12x de <span className="text-sky-900 font-bold">R$ {product.installment}</span>
          </p>

          {colors.length > 0 && (
            <div className="mt-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-700 mb-3">
                {product.variantLabel ?? "Cor"}: <span className="text-sky-900">{activeColor?.name}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => {
                  const active = c.name === activeColor?.name;
                  const idx = gallery.indexOf(c.img);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => { setSelectedColorName(c.name); if (idx >= 0) setImgIdx(idx); }}
                      aria-label={c.name}
                      title={c.name}
                      className={`h-9 w-9 rounded-full border-2 transition ${active ? "border-sky-900 ring-2 ring-sky-900/30" : "border-sky-200 hover:border-sky-400"}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-7">
            {isAdmin && product.kind !== "accessory" && (
              <div className="mb-3 flex items-center justify-between gap-2 p-2 border border-dashed border-sky-300 rounded-sm bg-sky-50/40">
                <span className="text-[11px] uppercase tracking-wide font-bold text-sky-700">
                  Modo admin {saveMutation.isPending && "(salvando…)"}
                </span>
                <button
                  type="button"
                  onClick={() => setEditMode((v) => !v)}
                  className={`inline-flex items-center gap-1 h-8 px-3 text-[11px] font-bold uppercase rounded-sm border ${
                    editMode ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-sky-900 border-sky-300"
                  }`}
                >
                  {editMode ? <><Check className="w-3.5 h-3.5" /> Concluir</> : <><Pencil className="w-3.5 h-3.5" /> Editar estoque</>}
                </button>
              </div>
            )}
            <SizeSelector
              product={product}
              shoe={shoe}
              setShoe={setShoe}
              clothing={clothing}
              setClothing={setClothing}
              soldOut={soldOutSizes}
              editMode={editMode && isAdmin}
              onToggleSoldOut={handleToggleSoldOut}
            />
            {editMode && isAdmin && (
              <p className="mt-2 text-[11px] text-slate-500">
                Clique nos tamanhos para alternar disponível / esgotado. As alterações são salvas automaticamente.
              </p>
            )}
          </div>



          {product.kind !== "accessory" && (
            <div className="mt-6">
              <p className="text-center text-[11px] uppercase tracking-[0.15em] text-sky-700">
                Restam apenas <span className="text-red-500 font-extrabold">{stock}</span> unidades desse produto
              </p>
              <div className="mt-2 h-1.5 bg-sky-100 rounded">
                <div className="h-full bg-blue-600 rounded" style={{ width: `${stockPct}%` }} />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-stretch gap-3">
            <div className="flex items-center border border-sky-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 h-12 text-sky-900/80 hover:text-sky-900"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 h-12 text-sky-900/80 hover:text-sky-900"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold uppercase tracking-[0.15em]">
              Adicionar ao carrinho
            </button>
          </div>


          <div className="mt-6 border border-sky-100 p-4">
            <p className="text-center text-[11px] uppercase tracking-[0.15em] text-sky-700 mb-3">
              Calcule o envio e prazo de entrega
            </p>
            <div className="flex gap-2">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="Digite seu CEP"
                className="flex-1 bg-transparent border border-sky-200 px-4 py-3 text-sm text-sky-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400"
              />
              <button className="bg-sky-700 border border-sky-200 px-5 text-[11px] font-bold uppercase tracking-[0.15em] text-sky-900">
                Calcular
              </button>
            </div>
          </div>

          <div className="mt-6 divide-y divide-sky-100 border-y border-sky-100">
            {[
              { icon: Headphones, label: "Suporte personalizado" },
              { icon: Package, label: "Informações do envio" },
              { icon: RefreshCw, label: "Trocas e devoluções" },
              { icon: ShieldCheck, label: "Compra 100% segura" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 py-4 text-sm text-sky-900/90">
                <Icon className="h-4 w-4 text-sky-700" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-10 border-t border-sky-100 mt-6">
        <div className="flex items-center justify-center gap-4 text-sky-900/80">
          <Truck className="h-7 w-7" />
          <div>
            <p className="text-xl font-extrabold text-sky-900">Entrega Garantida</p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Receba no prazo ou seu dinheiro de volta.</p>
          </div>
        </div>
      </div>

      <Section title="Produtos Relacionados" items={related} />
      <Footer />
    </main>
  );
}
