## Regra de ordenação (memória)

Salvar na memória do projeto: **cada novo produto enviado entra como o PRIMEIRO da lista de sneakers**, empurrando os anteriores para a direita. Assim, o produto mais recente aparece primeiro, e o anterior fica logo ao lado.

> Resultado visual em `/colecoes/sneakers`: produto 1 (mais novo) → produto 2 (enviado antes) → produto 3 → ...

## Produto a adicionar agora

**Tênis Nike Dunk Twist** — R$ 99,99 — categoria `sneakers`

- 7 imagens enviadas (image-484 a image-490) → upload via `lovable-assets` para `src/assets/tenis-nk-dunk-twist-{1..7}.png.asset.json`
- Imagem principal: image-484 (look usando o tênis)
- Galeria na ordem das uploads

## Mudanças em `src/lib/products.ts`

1. Adicionar os 7 imports dos `.asset.json` no topo (junto com outros imports de sneakers).
2. Inserir o novo produto como **primeira linha** do bloco de sneakers (antes de `tenis-pma-caven-ferrari`, linha 693):

```ts
{ slug: "tenis-nk-dunk-twist", title: "Tênis Nike Dunk Twist", price: "99,99", oldPrice: "499,99", installment: "9,99", off: "80% OFF", kind: "footwear", category: "sneakers", sold: 1, stock: 10, img: tenisNkDunkTwist1, images: [tenisNkDunkTwist1, tenisNkDunkTwist2, tenisNkDunkTwist3, tenisNkDunkTwist4, tenisNkDunkTwist5, tenisNkDunkTwist6, tenisNkDunkTwist7] },
```

Como a coleção `sneakers` é derivada de `products.filter(category === "sneakers")` mantendo a ordem do array, inserir no topo já garante que ele apareça em primeiro na grade. Próximos produtos seguirão a mesma regra (inserir no topo do bloco).

## Memória a atualizar

Adicionar ao Core de `mem://index.md`:
> Novos produtos são inseridos no TOPO da lista de sneakers em `src/lib/products.ts` (antes da linha de `tenis-pma-caven-ferrari`), para que o mais recente apareça primeiro e os anteriores fiquem ao lado na ordem de envio.

## Fora do escopo

- Mudar a ordem dos produtos sneakers já existentes.
- Adicionar variantes/tamanhos.
