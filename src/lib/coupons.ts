// Cupons disponíveis na loja.
// Mantido em arquivo client-safe (sem segredos) para ser usado tanto no
// checkout (validação visual) quanto no server (createDeposit).

export type Coupon = {
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number; // porcentagem (0-100) ou valor em R$
  firstPurchaseOnly?: boolean;
  minOrder?: number;
  freeShipping?: boolean;
};

export const COUPONS: Coupon[] = [
  {
    code: "PRIMEIRA20",
    label: "20% OFF na primeira compra",
    type: "percent",
    value: 20,
    firstPurchaseOnly: true,
  },
  {
    code: "PPL50",
    label: "35% OFF + Frete grátis",
    type: "percent",
    value: 35,
    freeShipping: true,
  },
  {
    code: "PPL50PP",
    label: "50% OFF",
    type: "percent",
    value: 50,
  },
];

export function findCoupon(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase();
  if (!c) return undefined;
  return COUPONS.find((x) => x.code === c);
}

export function calcDiscount(coupon: Coupon, subtotal: number): number {
  if (subtotal <= 0) return 0;
  const raw =
    coupon.type === "percent"
      ? (subtotal * coupon.value) / 100
      : coupon.value;
  const capped = Math.min(raw, subtotal);
  return Math.round(capped * 100) / 100;
}

export const FIRST_PURCHASE_FLAG = "ppl:has-purchased";
