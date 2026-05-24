## Mover produtos com "Kit" no nome para Kits Completos

### Produtos afetados

Atualmente existem 4 produtos cujo título contém "Kit" mas estão em outras categorias:

| Slug | Título | Categoria atual |
|---|---|---|
| `kit-3-bones-pma-bmw` | Kit 3 Bonés Pma BMW Motosport | `acessorios` |
| `kit-3-calcas-jeans-jogador` | Kit 3 Calças Jeans Jogador | `calcas` |
| `kit-5-camisetas-nk-academy` | Kit 5 Camisetas NK Academy Dri-Fit | `camisetas` |
| `kit-4-camisas-nk-academy` | Kit 4 Camisas NK Academy | `camisetas` |

Os demais produtos com "Kit" no título já estão em `kits-completos`.

### Mudanças em `src/lib/products.ts`

Para cada um dos 4 produtos acima, alterar:
- `category: "..."` → `category: "kits-completos"`
- `kind: "clothing" | "accessory"` → `kind: "kit"`

Como a seção "Kits Completos" da home e a página `/colecoes/kits-completos` filtram por `p.category === "kits-completos"`, esses produtos passam a aparecer automaticamente.

### Observações

- As transformações existentes em `nikeAcademy` (linhas 234–254) e `bones` (linhas 271–308) que reaproveitam slugs como `kit-4-camisas-nk-academy`, `kit-completo-nk-academy-4-pecas`, `kit-nk-academy-slide-bone` e `kit-3-bones-pma-bmw` para criar variantes "Conjunto NK Academy" e "Boné …" nas seções da home continuam funcionando — não mexo nessa lógica, só na categoria de origem.
- Nenhum produto precisa ser duplicado: o mesmo item passa a aparecer em Kits Completos e continua aparecendo nas seções da home derivadas por título (Bonés, Nike Academy) através dos `.map(...)` existentes.
- Não vou renomear slugs nem alterar preços/imagens.
