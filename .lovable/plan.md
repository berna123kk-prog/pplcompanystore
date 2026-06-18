# Busca de produtos funcional

Tornar o ícone da lupa (Header) realmente funcional, abrindo uma busca que encontra produtos pelo nome digitado.

## O que será feito

1. **`src/components/storefront.tsx`**
   - Adicionar estado `searchOpen` no `Header`.
   - O botão da lupa passa a abrir um overlay (Dialog/Sheet) com um campo de busca focado automaticamente.
   - Funciona tanto no desktop quanto no mobile.

2. **Novo componente `SearchDialog`** (no mesmo arquivo ou em `src/components/search-dialog.tsx`)
   - Input de texto controlado.
   - Filtra a lista completa de produtos importada de `src/lib/products.ts` por `title` (normalizado: lowercase + remoção de acentos), correspondência por substring.
   - Mostra até ~8 resultados com miniatura, título e preço.
   - Cada resultado é um `<Link to="/produtos/$slug">` que fecha o overlay ao clicar.
   - Mensagens: "Digite para buscar" (vazio) e "Nenhum produto encontrado" (sem matches).
   - Fecha com ESC, clique fora ou botão X.

3. **`src/lib/products.ts`**
   - Exportar (se ainda não existir) um array agregado `allProducts` reunindo todas as listas já exportadas, para a busca varrer o catálogo inteiro. Nenhuma alteração de produto, preço ou categoria.

## Fora de escopo

- Busca por categoria, tags, preço ou filtros avançados.
- Página dedicada `/busca` — por ora apenas overlay.
- Mudanças de layout do header, cores ou outros produtos.
