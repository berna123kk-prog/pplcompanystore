# Refinar visualmente o checkout

Aplicar a direção "Refinado moderno" mantendo toda a lógica existente (ViaCEP, frete Correios, PIX Elite PAY, polling de status). Apenas refatorar layout/estilos.

## Mudanças em `src/routes/checkout.tsx`

- Trocar layout para grid de 12 colunas: `lg:col-span-8` para a coluna dos passos e `lg:col-span-4` para o resumo. Resumo `sticky top-8`.
- Cards de passo com `rounded-2xl`, borda fina; passo ativo ganha `border-2 border-primary` + sombra suave; passos inativos ficam em `bg-muted/40` com opacidade reduzida e número em cinza.
- Header do passo: badge quadrado arredondado (10x10) com número, título all-caps com tracking 0.25em, separador inferior.
- Inputs em grid 2 colunas (md+), `bg-muted/30`, `rounded-xl`, padding generoso, focus com ring cyan suave.
- Botão "Continuar" full-width no mobile, `w-auto` no desktop, com `rounded-xl`, sombra colorida e hover scale.
- Reordenar JSX para que os 3 passos fiquem empilhados verticalmente na coluna principal (corrigir bug atual de Step 2 aparecer abaixo do resumo).
- Sidebar resumo: header com badge de "N ITENS", lista de itens com thumbnail 24x24 `rounded-xl`, nome em bold uppercase, variação em caps muted, preço em primary; subtotal/frete em linhas, total destacado grande em `font-black tracking-tighter`; banner promo PIX com bullet pulsante; badges SSL abaixo.
- Substituir cores hard-coded `#00B6F0` por tokens existentes do projeto (`primary` / `--brand`) — verificar `src/styles.css` para usar o token correto.
- Manter breadcrumb "Continuar Comprando" + título "FINALIZAR COMPRA" no topo.

## Responsivo

- `< lg`: grid colapsa para 1 coluna, resumo vai para baixo, sticky desativa.
- Inputs em 1 coluna no mobile, 2 no md+.
- Padding reduzido em telas pequenas (`p-6` → `p-8` em md+).

## Arquivos

- `src/routes/checkout.tsx` — único arquivo alterado.

Sem mudanças em server functions, schema, cart ou produtos.
