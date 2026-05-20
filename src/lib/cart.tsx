import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type CartItem = {
  slug: string;
  title: string;
  price: string;
  img: string;
  size?: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string, size?: string) => void;
  updateQty: (slug: string, qty: number, size?: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "ppl-cart-v1";

const parsePrice = (p: string) => {
  const n = Number(p.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const keyOf = (slug: string, size?: string) => `${slug}::${size ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem: CartContextType["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const k = keyOf(item.slug, item.size);
      const idx = prev.findIndex((p) => keyOf(p.slug, p.size) === k);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  };

  const removeItem: CartContextType["removeItem"] = (slug, size) => {
    setItems((prev) => prev.filter((p) => keyOf(p.slug, p.size) !== keyOf(slug, size)));
  };

  const updateQty: CartContextType["updateQty"] = (slug, qty, size) => {
    setItems((prev) =>
      prev
        .map((p) => (keyOf(p.slug, p.size) === keyOf(slug, size) ? { ...p, qty: Math.max(1, qty) } : p))
        .filter((p) => p.qty > 0),
    );
  };

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + parsePrice(i.price) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clear: () => setItems([]),
      }}
    >
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader>
          <SheetTitle className="text-sky-900 uppercase tracking-[0.15em] text-sm">
            Sua sacola ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 mt-4">
          {items.length === 0 ? (
            <div className="h-full grid place-items-center text-center text-slate-500 text-sm">
              <div>
                <p className="font-bold uppercase tracking-[0.15em] text-sky-900">Sacola vazia</p>
                <p className="mt-2 text-xs">Adicione produtos para continuar.</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-sky-100">
              {items.map((it) => (
                <li key={keyOf(it.slug, it.size)} className="py-4 flex gap-3">
                  <img src={it.img} alt={it.title} className="h-20 w-20 object-contain border border-sky-100 bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-sky-900 line-clamp-2">{it.title}</p>
                    {it.size && <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mt-1">Tam: {it.size}</p>}
                    <p className="text-sky-700 font-extrabold text-sm mt-1">R$ {it.price}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border border-sky-200">
                        <button onClick={() => updateQty(it.slug, it.qty - 1, it.size)} className="px-2 h-7 text-sky-900/80"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-xs font-bold">{it.qty}</span>
                        <button onClick={() => updateQty(it.slug, it.qty + 1, it.size)} className="px-2 h-7 text-sky-900/80"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(it.slug, it.size)} className="text-slate-400 hover:text-red-500" aria-label="Remover">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-sky-100 pt-4 mt-4 space-y-3">
            <div className="flex items-center justify-between text-sky-900">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Subtotal</span>
              <span className="text-lg font-extrabold">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold uppercase tracking-[0.15em]">
              Finalizar compra
            </button>
            <button onClick={closeCart} className="w-full h-10 border border-sky-200 text-sky-900 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-sky-50">
              Continuar comprando
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
