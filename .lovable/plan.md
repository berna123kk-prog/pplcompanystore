## Objetivo
No produto **BROOKSFILD DE FRIO**, adicionar 4 opções de cor (Preta, Verde, Branca, Vermelho) usando as 4 fotos enviadas. Ao tocar numa cor, a imagem principal troca e a cor escolhida vai junto ao carrinho.

## Passos

1. **Subir 4 novas imagens** via `lovable-assets` (CDN):
   - `brooksfild-de-frio-preta.jpg` ← IMG_…533_945 (preta)
   - `brooksfild-de-frio-verde.jpg` ← IMG_…534_286 (verde)
   - `brooksfild-de-frio-branca.jpg` ← IMG_…533_403 (branca)
   - `brooksfild-de-frio-vermelha.jpg` ← IMG_…534_182 (vermelha)

2. **`src/lib/products.ts`**
   - Adicionar campo opcional ao tipo `Product`:
     ```ts
     colors?: { name: string; img: string; hex: string }[];
     ```
   - Atualizar o produto na linha 902 (`brooksfild-de-frio`) e também a versão "featured" (linha 1283) para:
     - usar as 4 novas imagens em `images`
     - definir `img` como a preta (primeira foto)
     - preencher `colors` com as 4 cores apontando cada uma para sua imagem (hex: #000, #16a34a, #f5f5f0, #dc2626)

3. **`src/routes/produtos.$slug.tsx`**
   - Novo estado `color` (default = primeira cor, se existir).
   - Quando o usuário toca numa cor, atualizar `imgIdx` para o índice da imagem dessa cor (e vice-versa: clicar numa thumbnail seleciona a cor correspondente).
   - Renderizar o seletor de cor logo acima do seletor de tamanho: swatches circulares (`h-9 w-9 rounded-full` com `background hex`, borda dupla quando ativo) + label "Cor: <nome>".
   - Em `handleAddToCart`, incluir o nome da cor em `size` (ex: `"M / Preta"`).

## Fora de escopo
- Outros produtos, preço, estoque, categoria ou layout geral — nada muda.
- Não é criado um produto novo; é uma adição ao produto existente.
