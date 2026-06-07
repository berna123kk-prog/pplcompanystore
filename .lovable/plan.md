# Filtrar a seção "CA Pro e Caven" para mostrar só esses modelos

## Problema
Em `src/routes/index.tsx` linha 45 a seção `"CA Pro e Caven"` recebe `items={sneakers}` — o array inteiro de 89 tênis. Por isso Nike, Mizuno, NB, Lacoste, LV, Zara etc. caem ali junto.

## Solução
1. Em `src/lib/products.ts`, criar uma lista derivada `caProECaven` filtrando do array `sneakers` apenas os slugs que começam com `tenis-pma-ca-pro` ou `tenis-pma-caven` (inclui todas as variantes BMW, Ferrari, Classic, etc. das linhas CA Pro e Caven da Puma).
2. Em `src/routes/index.tsx`, trocar `items={sneakers}` por `items={caProECaven}` na seção "CA Pro e Caven".
3. Criar uma segunda seção logo abaixo, `"Outros Sneakers"`, com o restante (`sneakers.filter(p => !caProECaven.includes(p))`), para que os demais tênis (Nike, Mizuno, NB, Lacoste, LV, Zara) continuem visíveis na home — senão eles somem da página inicial.

## Regra de ordenação preservada
O array `sneakers` continua sendo a fonte única, e novos produtos seguem entrando na primeira linha. A ordem dentro de cada bucket é a mesma do array original.

## Fora do escopo
- Não muda categorias, slugs, imagens, páginas de detalhe nem checkout.
- Não renomeia o título "CA Pro e Caven".
