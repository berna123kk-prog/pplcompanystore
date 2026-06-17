## Problema
No mobile, o header mostra os itens de nível 1 (Vestuário, Acessórios, Slides, Sneakers, Perfumes) em uma única linha centralizada, mas:
- "Vestuário" não revela as subcategorias (Camisetas, Jaquetas e Moletons, Calças, Bermudas e Shorts, Kits Completos) — no desktop elas aparecem via hover, mas no mobile não há hover nem clique para abrir.
- A linha única com 5 itens espreme/quebra o texto em telas estreitas.

## Solução
Reescrever apenas o bloco `<nav className="md:hidden ...">` em `src/components/storefront.tsx` (linhas 119–130), sem mexer no menu desktop.

1. Transformar a nav mobile em uma faixa com **scroll horizontal** (`overflow-x-auto`, `whitespace-nowrap`, esconder scrollbar), para caber todos os itens sem quebrar.
2. Para o item "Vestuário" (que tem `sub`), trocar o `Link` por um **botão toggle** com `ChevronDown` que abre/fecha um painel abaixo da nav listando as subcategorias (Camisetas, Jaquetas e Moletons, Calças, Bermudas e Shorts, Kits Completos), cada uma como `Link` para `/colecoes/$slug`.
3. O painel de subcategorias aparece em largura total abaixo da faixa de categorias, com fundo branco/sky claro, fechando ao clicar em uma opção.
4. Manter exatamente os mesmos slugs e estilo visual (uppercase, tracking, cor branca sobre o header azul).

## Fora de escopo
- Menu desktop permanece igual.
- Nenhuma mudança em produtos, rotas ou lógica de carrinho.