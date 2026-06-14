import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE_URL = "https://api.elitepaybr.com";

function authHeaders() {
  const clientId = process.env.ELITEPAY_CLIENT_ID;
  const clientSecret = process.env.ELITEPAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Credenciais Elite PAY não configuradas no servidor.");
  }
  return {
    "x-client-id": clientId,
    "x-client-secret": clientSecret,
    "Content-Type": "application/json",
  };
}

import { getProduct } from "./products";
import { findCoupon, calcDiscount } from "./coupons";

const depositSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(200),
        qty: z.number().int().positive().max(99),
      }),
    )
    .min(1)
    .max(50),
  payerName: z.string().trim().min(2).max(120),
  payerDocument: z.string().trim().min(11).max(20),
  shippingAmount: z.number().min(0).max(500).optional(),
  couponCode: z.string().trim().max(40).optional(),
});


export type DepositResult = {
  transactionId?: string;
  qrCode?: string;
  qrCodeImage?: string;
  amount?: number;
};

function parseBrlPrice(p: string): number {
  const n = Number(p.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function pickString(obj: unknown, keys: string[]): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const o = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  for (const nestedKey of ["transaction", "data", "pix", "result"]) {
    const nested = o[nestedKey];
    if (nested && typeof nested === "object") {
      const found = pickString(nested, keys);
      if (found) return found;
    }
  }
  return undefined;
}

export const createDeposit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => depositSchema.parse(input))
  .handler(async ({ data }): Promise<DepositResult> => {
    // Server-side price calculation — never trust client amounts.
    let amount = 0;
    const titles: string[] = [];
    for (const it of data.items) {
      const product = getProduct(it.slug);
      if (!product) {
        throw new Error(`Produto não encontrado: ${it.slug}`);
      }
      amount += parseBrlPrice(product.price) * it.qty;
      titles.push(product.title);
    }
    if (data.shippingAmount && data.shippingAmount > 0) {
      amount += data.shippingAmount;
    }
    amount = Math.round(amount * 100) / 100;
    if (amount <= 0) {
      throw new Error("Total do pedido inválido.");
    }
    if (amount < 5) {
      throw new Error("Valor mínimo para pagamento via PIX é R$ 5,00.");
    }


    const description = `Pedido ${data.items.length} item(ns) - ${titles.join(", ").slice(0, 150)}`;

    const payload = {
      amount,
      description,
      payer: {
        name: data.payerName,
        document: data.payerDocument,
      },
      paymentMethod: "PIX",
    };

    console.log("[ElitePAY] POST /api/v1/deposit payload:", JSON.stringify(payload));

    const res = await fetch(`${BASE_URL}/api/v1/deposit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {}

    console.log("[ElitePAY] response status:", res.status, "body:", text.slice(0, 1000));

    if (!res.ok) {
      const apiMsg =
        body && typeof body === "object" && body !== null
          ? (body as Record<string, unknown>).message ??
            (body as Record<string, unknown>).error ??
            (body as Record<string, unknown>).errors
          : null;
      const msg = apiMsg
        ? `Elite PAY: ${typeof apiMsg === "string" ? apiMsg : JSON.stringify(apiMsg)}`
        : `Falha na Elite PAY (${res.status}): ${text.slice(0, 200)}`;
      throw new Error(msg);
    }

    return {
      amount,
      transactionId: pickString(body, ["transactionId", "id", "transaction_id"]),
      qrCode: pickString(body, [
        "qrCode",
        "qrcode",
        "copyPaste",
        "copy_paste",
        "pixCopiaECola",
        "emv",
        "brCode",
      ]),
      qrCodeImage: pickString(body, [
        "qrCodeImage",
        "qrCodeBase64",
        "qrcodeImage",
        "image",
      ]),
    };
  });

export const checkTransaction = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ transactionId: z.string().min(1).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const paths = ["/api/v1/transactions/check", "/api/transactions/check"];
    for (const p of paths) {
      try {
        const res = await fetch(`${BASE_URL}${p}`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ transactionId: data.transactionId }),
        });
        const text = await res.text();
        let body: unknown = text;
        try {
          body = JSON.parse(text);
        } catch {}
        console.log(`[ElitePAY] check ${p} status:`, res.status, "body:", text.slice(0, 300));
        if (res.status === 404) continue;
        if (!res.ok) return { status: "UNKNOWN" };
        const state =
          pickString(body, ["transactionState", "status", "state"]) ?? "UNKNOWN";
        return { status: state.toUpperCase() };
      } catch (err) {
        console.error("[ElitePAY] check error:", err);
      }
    }
    return { status: "UNKNOWN" };
  });
