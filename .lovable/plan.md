# Corrigir erro "Produto não encontrado" ao gerar PIX

## Problema
No checkout, ao clicar em "Gerar PIX" com um item como **Kit Lacoste Branco + Mizuno**, aparece o erro:

> Produto não encontrado: kit-lacoste-branco-mizuno-featured

Causa: a server function `createDeposit` em `src/lib/elitepay.functions.ts` procura o produto apenas no array `products`. Porém os itens vêm de outros arrays do catálogo (`featured`, `sneakers`, `kits`), então slugs como `kit-lacoste-branco-mizuno-featured` nunca são encontrados e o PIX falha antes de chamar o gateway.

O próprio `src/lib/products.ts` já expõe a função `getProduct(slug)` que busca em **todos** os arrays — basta usá-la.

## Mudança
Arquivo único: `src/lib/elitepay.functions.ts`

- Trocar o import de `products` por `getProduct` (de `./products`).
- No `.handler` de `createDeposit`, substituir
  `products.find((p) => p.slug === it.slug)` por `getProduct(it.slug)`.

Nada mais muda: cálculo de preço, validação, chamada à Elite PAY e polling continuam iguais. Somente a busca do produto passa a cobrir destaques, sneakers e kits, além de `products`.

## Validação
- Adicionar o Kit Lacoste Branco + Mizuno à sacola, ir ao checkout, preencher nome/CPF e clicar em "Gerar PIX" → deve gerar o QR code normalmente em vez do erro vermelho.
- Repetir com um produto da grade normal (ex: uma bermuda) para garantir que o fluxo padrão continua funcionando.
