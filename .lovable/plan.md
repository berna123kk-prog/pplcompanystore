## Adicionar "Blusa Lacoste Frio" em Jaquetas e Moletons

**Preço:** R$ 129,99

### Passos

1. Copiar a imagem enviada para `src/assets/blusa-lacoste-frio.png`.
2. Em `src/lib/products.ts`:
   - Importar a nova imagem.
   - Adicionar um novo produto ao array `products` com:
     - slug: `blusa-lacoste-frio`
     - title: `Blusa Lacoste Frio`
     - price: `129,99`
     - oldPrice: `799,99`, installment: `12,99`, off: `83% OFF` (coerente com vizinhos)
     - kind: `clothing`, category: `jaquetas-e-moletons`
     - img/images apontando para a nova imagem

Sem mudanças em UI — a página `/colecoes/jaquetas-e-moletons` já filtra por categoria.