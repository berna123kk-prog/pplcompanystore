# Adicionar opção de boné Branco/Preto nos dois kits Mizuno

## Problema
1. Existem **dois** produtos com o título "KIT COMPLETO MIZUNO 4 PEÇAS":
   - `kit-mizuno-branco-2026-featured` (já tem o seletor adicionado)
   - `kit-completo-mizuno-kits` (sem seletor) ← é o que você está vendo agora
2. No kit que já tem o seletor, **não dá para selecionar "Boné Preto"** porque a página identifica a variante ativa pela imagem (`colors.find(c => c.img === currentImage)`). Como as duas variantes apontam para a mesma imagem, ele sempre marca a primeira (Branco) como ativa.

## Mudanças

**1. `src/lib/products.ts`** — adicionar o mesmo `variantLabel: "Boné"` + `colors` (Branco/Preto) no produto `kit-completo-mizuno-kits` (linha 1847).

**2. `src/routes/produtos.$slug.tsx`** — corrigir a seleção de variante:
- Adicionar `const [selectedColorName, setSelectedColorName] = useState<string | null>(null)`.
- `activeColor`: usar `colors.find(c => c.name === selectedColorName)` primeiro, com fallback para `colors.find(c => c.img === currentImage) ?? colors[0]`.
- No `onClick` do botão da variante, chamar `setSelectedColorName(c.name)` além do `setImgIdx` atual.
- Resetar `selectedColorName` quando o produto muda (efeito ligado ao `slug`).

Assim, mesmo quando duas variantes compartilham a imagem, cada uma pode ser selecionada visualmente.

## Fora de escopo
- Carrinho/checkout não persistem a variante escolhida (não existe carrinho no projeto).
- Não vou unificar/deduplicar os dois produtos Mizuno — pode ser intencional ter dois.
