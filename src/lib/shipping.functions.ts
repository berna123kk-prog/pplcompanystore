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

type Region = "SE" | "S" | "CO" | "NE" | "N";

const REGION_PRICES: Record<Region, { pac: number; sedex: number; motoboy: number; uber: number }> = {
  SE: { pac: 13.98, sedex: 28.70, motoboy: 31.99, uber: 44.50 },
  S:  { pac: 19.45, sedex: 34.20, motoboy: 38.90, uber: 47.80 },
  CO: { pac: 22.60, sedex: 41.15, motoboy: 43.25, uber: 49.90 },
  NE: { pac: 26.85, sedex: 46.90, motoboy: 48.10, uber: 51.20 },
  N:  { pac: 29.95, sedex: 49.30, motoboy: 50.50, uber: 52.00 },
};

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
    let uf: string | undefined;
    try {
      const r = await fetch(`https://brasilapi.com.br/api/cep/v1/${data.cep}`);
      if (r.ok) {
        const j = (await r.json()) as { state?: string };
        if (j.state) uf = j.state.toUpperCase();
      }
    } catch {}

    const region: Region = (uf && REGION_BY_UF[uf]) || "SE";
    const p = REGION_PRICES[region];

    return {
      uf,
      options: [
        { id: "MOTOBOY", name: "Motoboy Loggi", price: p.motoboy, days: "Receba no mesmo dia", badge: "FULL" },
        { id: "UBER", name: "Frete Uber Expresso", price: p.uber, days: "Receba em 30min (Válido para sua região)", badge: "FULL" },
        { id: "PAC", name: "Correios PAC", price: p.pac, days: "4 a 7 dias" },
        { id: "SEDEX", name: "Correios Sedex", price: p.sedex, days: "2 a 3 dias" },
      ],
    };
  });

