import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { TopBanner, Header, Footer, ProductCard } from "@/components/storefront";
import { COLLECTIONS, products } from "@/lib/products";

export const Route = createFileRoute("/colecoes/$slug")({
  loader: ({ params }) => {
    const col = COLLECTIONS[params.slug];
    if (!col) throw notFound();
    return { title: col.title, items: products.filter(col.filter), slug: params.slug };
  },
  component: CollectionPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Coleção"} — VSN Store` },
      { name: "description", content: `${loaderData?.title ?? "Coleção"} na VSN Store.` },
    ],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen bg-background text-foreground grid place-items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Coleção não encontrada</h1>
        <Link to="/" className="mt-4 inline-block text-blue-500 underline">Voltar para a loja</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <main className="min-h-screen bg-background text-foreground grid place-items-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-xl font-bold">Erro ao carregar coleção</h1>
          <p className="text-slate-500 text-sm mt-2">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 bg-blue-600 px-5 py-2 text-sm font-bold uppercase">
            Tentar novamente
          </button>
        </div>
      </main>
    );
  },
});

function CollectionPage() {
  const { title, items } = Route.useLoaderData();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopBanner />
      <Header />

      <div className="max-w-[1400px] mx-auto px-6 pt-6 text-[11px] uppercase tracking-[0.15em] font-bold text-slate-500">
        <Link to="/" className="hover:text-sky-900">Home</Link>
        <span className="mx-2 text-slate-300">›</span>
        <span className="text-sky-900">{title}</span>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-end justify-between border-b border-sky-100 pb-5 mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-[0.1em] text-sky-900">{title}</h1>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">
            <span><span className="text-blue-400">Availability</span></span>
            <span>Price</span>
            <span className="text-sky-900">{items.length} {items.length === 1 ? "Item" : "Itens"}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center text-slate-500">
            <p className="text-sm uppercase tracking-[0.2em]">Nenhum produto disponível nesta coleção no momento.</p>
            <Link to="/" className="mt-6 inline-block text-blue-500 underline text-xs uppercase tracking-[0.2em]">Voltar para o início</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {items.map((p: import("@/lib/products").Product) => <ProductCard key={p.slug} p={p} />)}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
