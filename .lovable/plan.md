Add new product "Moletom BMW Motosport" to the **Jaquetas e Moletons** category in `src/lib/products.ts`.

## Steps
1. Copy `user-uploads://image-237.png` → `src/assets/moletom-bmw-motosport.png`
2. In `src/lib/products.ts`:
   - Add import for the new image
   - Add product entry:
     - slug: `moletom-bmw-motosport`
     - title: `Moletom BMW Motosport`
     - price: `99,99`
     - installment: `9,99`
     - oldPrice: `249,99`
     - off: `60% OFF`
     - kind: `hoodie`
     - category: `jaquetas-e-moletons`
     - sold: 1, stock: 20
     - img/images: new asset