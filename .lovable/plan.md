## Objetivo

Substituir o cálculo atual de frete por uma tabela fixa por região (5 regiões do Brasil), aplicada às 4 modalidades. Os preços não dependerão mais de peso/quantidade de itens — apenas da região do CEP.

## Tabela aplicada

| Região (UFs) | PAC (4–7d) | Sedex (2–3d) | Motoboy Loggi (mesmo dia) | Uber Expresso (30min) |
|---|---|---|---|---|
| Sudeste (SP, RJ, MG, ES) | R$ 13,98 | R$ 28,70 | R$ 31,99 | R$ 44,50 |
| Sul (PR, SC, RS) | R$ 19,45 | R$ 34,20 | R$ 38,90 | R$ 47,80 |
| Centro-Oeste (DF, GO, MT, MS) | R$ 22,60 | R$ 41,15 | R$ 43,25 | R$ 49,90 |
| Nordeste (AL, BA, CE, MA, PB, PE, PI, RN, SE) | R$ 26,85 | R$ 46,90 | R$ 48,10 | R$ 51,20 |
| Norte (AC, AM, AP, PA, RO, RR, TO) | R$ 29,95 | R$ 49,30 | R$ 50,50 | R$ 52,00 |

Obs.: você pediu granularidade por UF, mas a tabela enviada está em nível de região. Vou aplicar por região (todos os estados dentro de uma região recebem o mesmo preço). Se quiser variar preço entre UFs da mesma região depois, é só mandar os valores específicos.

## Mudanças

**`src/lib/shipping.functions.ts`**
- Substituir o objeto `PRICING` por uma tabela única `REGION_PRICES` com os 4 preços + prazos por região.
- Remover cálculo por peso (`itemsCount * 0.6`, `base + perKg * weight`) — preços passam a ser fixos por região.
- Manter detecção de UF via BrasilAPI e fallback para Sudeste quando CEP não for resolvido.
- Motoboy e Uber também passam a variar por região (antes eram fixos em R$ 31,99 e R$ 59,08).
- Textos de prazo: "4 a 7 dias", "2 a 3 dias", "Receba no mesmo dia", "Receba em 30min (Válido para sua região)".

Nenhuma mudança em `checkout.tsx` — ele já consome `options[].price` e `options[].days` direto do servidor.

## Fora do escopo

- Persistir escolha de frete em tabela de pedidos (não solicitado agora).
- Variar preços entre estados da mesma região.
- Restringir Motoboy/Uber a cidades específicas.
