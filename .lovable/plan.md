## Atualizar regra padrão de categoria

Atualizar `mem://index.md` para registrar a nova regra:

- **Antes:** novos produtos enviados pelo usuário vão para a categoria `camisetas`.
- **Depois:** novos produtos enviados pelo usuário vão para a categoria `perfumes`, até instrução em contrário.

Nenhuma alteração em código nesta etapa. A regra passa a valer no próximo produto que você enviar — ele será adicionado em `src/lib/products.ts` dentro da categoria `perfumes`, seguindo o mesmo padrão já usado (imports de imagens em `src/assets/`, slug, title, price, installment, oldPrice, off, kind, sold, stock).
