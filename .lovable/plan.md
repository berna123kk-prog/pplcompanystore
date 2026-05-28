## Mudança

No menu mobile do `Header` (src/components/storefront.tsx):

1. Remover o item "Kits" do array `navItems` (linha 27). Isso remove tanto do desktop quanto do mobile — "Kits Completos" continua acessível pelo dropdown de "Vestuário" no desktop e pela URL `/colecoes/kits-completos`.
2. No `<nav>` mobile (linhas 113-125), reduzir o `gap-5` para `gap-4` e remover o `overflow-x-auto` / `whitespace-nowrap`, deixando os 5 itens restantes (Vestuário, Acessórios, Slides, Sneakers, Perfumes) realmente centralizados e visíveis sem rolagem em ~384px.

Desktop continua intocado fora da remoção do item "Kits".