import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Tabela regional aproximada baseada em valores médios PAC/Sedex.
// Origem: Belo Horizonte/MG (centro-leste). Valores em R$ por kg base.
// Marcado como "estimado" — preços oficiais variam por peso/dimensões.
const REGION_BY_UF: Record<string, "SE" | "S" | "CO" | "NE" | "N"> = {
  SP: "SE", RJ: "SE", MG: "SE", ES: "SE",
  PR: "S", SC: "S", RS: "S",
  GO: "CO", DF: "CO", MT: "CO", MS: "CO",
  BA: "NE", SE: "NE", AL: "NE", PE: "NE", PB: "NE", RN: "NE", CE: "NE", PI: "NE", MA: "NE",
  PA: "N", AP: "N", AM: "N", RR: "N", AC: "N", RO: "N", TO: "N",
};

const PRICING = {
  PAC:   { SE: { base: 18.9, perKg: 4.5, days: "4 a 7 dias" }, S:  { base: 22.5, perKg: 5.2, days: "5 a 9 dias" }, CO: { base: 24.9, perKg: 5.9, days: "6 a 10 dias" }, NE: { base: 28.9, perKg: 7.1, days: "7 a 12 dias" }, N:  { base: 34.9, perKg: 8.4, days: "9 a 15 dias" } },
  SEDEX: { SE: { base: 32.5, perKg: 6.5, days: "2 a 3 dias" }, S:  { base: 38.9, perKg: 7.8, days: "3 a 5 dias" }, CO: { base: 42.9, perKg: 8.5, days: "3 a 5 dias" }, NE: { base: 48.9, perKg: 9.8, days: "4 a 7 dias" }, N:  { base: 56.9, perKg: 11.2, days: "5 a 9 dias" } },
} as const;

const inputSchema = z.object({
  cep: z.string().trim().regex(/^\d{8}$/, "CEP inválido"),
  itemsCount: z.number().int().positive().max(99),
});

export type ShippingOption = {
  id: "PAC" | "SEDEX" | "MOTOBOY" | "UBER";
  name: string;
  price: number;
  days: string;
  badge?: "FULL";
};

export const getShippingOptions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<{ options: ShippingOption[]; uf?: string }> => {
    // Descobre UF via BrasilAPI (sem necessidade de credenciais).
    let uf: string | undefined;
    try {
      const r = await fetch(`https://brasilapi.com.br/api/cep/v1/${data.cep}`);
      if (r.ok) {
        const j = (await r.json()) as { state?: string };
        if (j.state) uf = j.state.toUpperCase();
      }
    } catch {}

    const region: "SE" | "S" | "CO" | "NE" | "N" = (uf && REGION_BY_UF[uf]) || "SE";
    // Peso estimado: 0.6kg por item (calçados/roupas).
    const weight = Math.max(0.5, data.itemsCount * 0.6);

    const round = (n: number) => Math.round(n * 100) / 100;
    const pac = PRICING.PAC[region];
    const sedex = PRICING.SEDEX[region];

    return {
      uf,
      options: [
        { id: "MOTOBOY", name: "Motoboy Loggi", price: 31.99, days: "Receba no mesmo dia", badge: "FULL" },
        { id: "UBER", name: "Frete Uber Expresso", price: 59.08, days: "Receba em 30min (Válido para sua região)", badge: "FULL" },
        { id: "PAC", name: "Correios PAC", price: round(pac.base + pac.perKg * weight), days: pac.days },
        { id: "SEDEX", name: "Correios Sedex", price: round(sedex.base + sedex.perKg * weight), days: sedex.days },
      ],
    };
  });
