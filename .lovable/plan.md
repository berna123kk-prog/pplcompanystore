## O que aconteceu

Os shorts não foram removidos de propósito — eles sumiram numa edição em massa de preços feita em 17/06/2026. Nessa alteração, 13 produtos da categoria "Bermudas e Shorts" foram apagados junto do bloco editado (a edição chegou a deixar um `...` solto no arquivo, sinal de recorte errado).

Hoje a aba "Bermudas e Shorts" mostra apenas 3 itens:
- Shorts Nk Praia
- Short Tommy Exclusivo
- Short Tommy Exclusivo (destaque)

As imagens continuam no projeto e os `import` delas ainda estão no catálogo — só as fichas dos produtos foram apagadas.

## Produtos a restaurar

| Produto | Preço na época |
| --- | --- |
| Bermuda Jeans Jogador (escura) | R$ 69,99 |
| Bermuda Jeans Jogador (clara) | R$ 79,90 |
| Bermuda Jeans Jogador (clara 2) | R$ 79,99 |
| Bermuda Jeans Jogador (destroyed) | R$ 69,99 |
| Shorts NK Praia Azul | R$ 69,99 |
| Shorts NK Praia Cinza | R$ 69,99 |
| Shorts NK Praia Chuva de NK | R$ 79,99 |
| Bermuda NK By Swoosh | R$ 69,99 |
| 2 Bermudas NK Swoosh | R$ 99,99 (era R$ 999,99, claramente errado) |
| Shorts NK Sportswear | R$ 69,99 |
| Kit 3 Bermudas NK Dri-FIT | R$ 79,99 |
| Shorts NK Athletics | R$ 69,99 |

## Como faço

1. Recupero as fichas exatas desses produtos da versão anterior do catálogo (`src/lib/products.ts`), com slug, título, preço, parcelas, estoque e galeria de imagens originais.
2. Reinsiro todas no array de produtos, na categoria `bermudas-e-shorts`, mantendo os imports de imagem que já existem (confirmo que cada arquivo em `src/assets` continua presente; se algum sumiu, aviso).
3. Corrijo o preço do "2 Bermudas NK Swoosh" de R$ 999,99 para R$ 99,99, alinhado aos demais.
4. Abro a aba /colecoes/bermudas-e-shorts no navegador para conferir que os 15 itens aparecem com imagem e preço corretos.

## Detalhes técnicos

- Arquivo único: `src/lib/products.ts`. Nada muda na página de coleção, que já filtra por `p.category === "bermudas-e-shorts"`.
- Restauro via `git show <commit-pai>:src/lib/products.ts` para copiar as linhas originais, sem tocar em outros produtos nem reverter os ajustes de preço feitos depois.
