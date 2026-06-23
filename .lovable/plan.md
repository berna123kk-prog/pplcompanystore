## Objetivo
Fazer a seção "Produtos Relacionados" (na página de cada produto) mostrar sempre itens parecidos com o produto em destaque, em vez dos 6 primeiros produtos quaisquer.

## Mudança
Arquivo: `src/routes/produtos.$slug.tsx` (linha 261)

Hoje:
```ts
const related = products.filter((p) => p.slug !== product.slug).slice(0, 6);
```

Passar a priorizar produtos da **mesma categoria** do produto em destaque, com fallback para a mesma `kind` (clothing / kit / sneaker / accessory / etc.) caso falte item, e por fim completar com outros produtos para sempre ter 6 cards:

1. Filtra produtos com `p.category === product.category` (exceto o próprio).
2. Se sobrar menos de 6, completa com produtos da mesma `kind`.
3. Se ainda sobrar menos de 6, completa com o restante do catálogo.
4. Embaralha levemente (ordem estável por slug) e corta em 6.

Resultado: na página de uma jaqueta aparecem outras jaquetas/moletons; na página de um kit aparecem outros kits; na de um tênis, outros sneakers; etc.

## Fora de escopo
- Não muda layout, título da seção, nem o componente `Section`.
- Não mexe em `src/lib/products.ts`.
