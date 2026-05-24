## Adicionar segunda imagem ao "Bermuda Jeans Jogador"

Mesma bermuda já cadastrada (R$ 69,99) — a nova foto será adicionada como imagem complementar da galeria.

1. Copiar `user-uploads://image-172.png` para `src/assets/bermuda-jeans-jogador-2.png`.
2. Em `src/lib/products.ts`:
   - Importar `bermudaJeansJogador2`.
   - Atualizar o produto `bermuda-jeans-jogador` para `images: [bermudaJeansJogador, bermudaJeansJogador2]` (mantém `img` principal como a primeira foto).