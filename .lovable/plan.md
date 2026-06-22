# Adicionar opção branca dentro da Jaqueta Lacoste Miami Open 2026

## O que será feito

1. **Subir as 5 imagens enviadas** como assets CDN (`lovable-assets create`), gerando pointers em `src/assets/`:
   - `jaqueta-miami-open-2026-branca-1.png.asset.json` (img 898 — frente capa)
   - `jaqueta-miami-open-2026-branca-2.png.asset.json` (img 895)
   - `jaqueta-miami-open-2026-branca-3.png.asset.json` (img 894)
   - `jaqueta-miami-open-2026-branca-4.png.asset.json` (img 896)
   - `jaqueta-miami-open-2026-branca-5.png.asset.json` (img 897)

2. **Editar `src/lib/products.ts`** (produto `jaquetaMiamiOpen2026Featured`, linha ~1418):
   - Adicionar os 5 novos imports junto aos da jaqueta atual.
   - Acrescentar as 5 imagens brancas ao array `images` (depois das 4 azuis).
   - Adicionar campo `colors` com 2 opções, seguindo o padrão do produto Brooksfield:
     ```
     colors: [
       { name: "Azul", img: jaquetaMiamiOpen2026_1.url, hex: "#1e3a5f" },
       { name: "Branca", img: jaquetaMiamiOpen2026Branca1.url, hex: "#f5f5f0" },
     ]
     ```
   - `img` (capa do card) permanece a azul atual.
   - Demais campos (preço, slug, estoque) inalterados.

## Fora de escopo

- Não cria produto separado.
- Não altera preço, layout ou componentes.
- Não muda a capa do card na listagem.
