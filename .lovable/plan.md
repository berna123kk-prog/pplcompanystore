## Adicionar produto em "Produtos em Destaque"

**Novo produto:** Kit Lacoste Branco + Mizuno — R$ 239,99

### Passos

1. Copiar a imagem enviada para `src/assets/kit-lacoste-branco-mizuno.png`.
2. Em `src/lib/products.ts`:
   - Importar a nova imagem.
   - Criar `kitLacosteBrancoMizunoFeatured: Product` com:
     - slug: `kit-lacoste-branco-mizuno-featured`
     - title: `Kit Lacoste Branco + Mizuno`
     - price: `239,99`
     - oldPrice/installment/off coerentes com os outros featured (ex.: oldPrice `799,99`, installment `23,99`, off `70% OFF`)
     - kind: `kit`, category: `kits-completos`
     - img/images apontando para a nova imagem
   - Adicionar ao array `featured` (no início, junto aos outros itens fixos).

Sem mudanças em UI — a página inicial já renderiza `featured` na seção "Produtos em Destaque".