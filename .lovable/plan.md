# Marcar tamanhos esgotados (riscados) por produto

## Como vai funcionar

Cada produto poderá ter uma lista opcional de tamanhos esgotados. Esses tamanhos aparecem na página do produto **riscados, em cinza e não-clicáveis**, indicando claramente que não estão disponíveis. Os demais tamanhos continuam selecionáveis normalmente.

Para "riscar" um tamanho, você (ou eu, a seu pedido) edita o produto em `src/lib/products.ts` adicionando os tamanhos esgotados — ex:

```ts
{ slug: "jaqueta-miami-open-2026-featured", ..., soldOutSizes: ["P", "GG"] }
```

Para tênis seria o mesmo, ex: `soldOutSizes: ["33", "43"]`.

## O que será alterado

1. **`src/lib/products.ts`** — Adicionar campo opcional `soldOutSizes?: string[]` no tipo `Product`.
2. **`src/routes/produtos.$slug.tsx`** — No `SizeGrid`:
   - Receber lista de tamanhos esgotados.
   - Renderizar esses botões com `line-through`, cor esmaecida, `cursor-not-allowed` e `disabled`.
   - Se o tamanho atualmente selecionado estiver esgotado, trocar a seleção inicial automaticamente para o primeiro tamanho disponível.

## Fora de escopo

- Não cria painel admin / UI para editar pelo navegador (continua sendo edição no código).
- Não mexe em estoque numérico geral, carrinho, checkout, banco de dados.
- Não altera estilo de cards na listagem.

## Pergunta rápida

Quer começar marcando algum tamanho agora (qual produto e quais tamanhos)? Ou só implemento a funcionalidade e você me avisa depois?
