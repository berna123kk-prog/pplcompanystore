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

const depositSchema = z.object({
  amount: z.number().positive().max(100000),
  description: z.string().trim().min(1).max(200),
  payerName: z.string().trim().min(2).max(120),
  payerDocument: z.string().trim().min(11).max(20),
});

export type DepositResult = {
  transactionId?: string;
  qrCode?: string;
  qrCodeImage?: string;
};

function pickString(obj: unknown, keys: string[]): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const o = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  // search nested transaction / data field
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
    const res = await fetch(`${BASE_URL}/api/v1/deposit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {}

    if (!res.ok) {
      const msg =
        (body && typeof body === "object" && "message" in body
          ? String((body as Record<string, unknown>).message)
          : null) || `Falha na Elite PAY (${res.status})`;
      throw new Error(msg);
    }

    return {
      transactionId: pickString(body, [
        "transactionId",
        "id",
        "transaction_id",
      ]),
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
    const res = await fetch(`${BASE_URL}/api/transactions/check`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ transactionId: data.transactionId }),
    });

    const text = await res.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {}

    if (!res.ok) {
      return { status: "UNKNOWN" };
    }

    const state =
      pickString(body, ["transactionState", "status", "state"]) ?? "UNKNOWN";
    return { status: state.toUpperCase() };
  });
