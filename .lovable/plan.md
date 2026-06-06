# Adicionar Motoboy Loggi e Uber Expresso ao frete

Em `src/lib/shipping.functions.ts`, adicionar duas opções fixas extras na lista retornada por `getShippingOptions`, junto com PAC e Sedex:

- **Motoboy Loggi** — R$ 31,99 — "Receba no mesmo dia" — badge "FULL"
- **Frete Uber Expresso** — R$ 59,08 — "Receba em 30min (Válido para sua região)" — badge "FULL"

Em `src/routes/checkout.tsx`, atualizar a renderização das opções no Step 2 para mostrar:
- badge verde "⚡ FULL" ao lado do nome quando `opt.badge === "FULL"`
- linhas de descrição multi-linha (campo `days` já suporta texto)

Sem mudanças em valores fixos (não conectar à API externa para estas duas — preço fixo conforme print).

## Arquivos
- `src/lib/shipping.functions.ts` — incluir as duas opções no array de retorno
- `src/routes/checkout.tsx` — renderizar badge FULL no label do radio
