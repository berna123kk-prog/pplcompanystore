## Plano

Adicionar o produto **Boné Lacoste L Bordado** (azul marinho) na categoria `acessorios` por R$ 129,99 — wait, o usuário pediu R$ 219,99.

Adicionar o produto **Boné Lacoste L Bordado** na categoria `acessorios` por **R$ 219,99**, com as 4 imagens enviadas.

### Passos
1. Subir as 4 imagens para o CDN via `lovable-assets` como `bone-lcst-l-bordado-{1..4}.png`.
2. Em `src/lib/products.ts`:
   - Importar os 4 `.asset.json`.
   - Inserir entrada nova ao lado dos demais bonés Lacoste:
     - slug: `bone-lcst-l-bordado`
     - title: `Boné Lacoste L Bordado`
     - price: `219,99`, oldPrice: `549,99`, installment: `21,99`, off: `60% OFF`
     - kind: `accessory`, category: `acessorios`, sold: 1, stock: 20
     - imagens: as 4 URLs.
