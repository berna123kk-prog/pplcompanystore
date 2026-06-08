## Objetivo

Criar um único arquivo de configuração onde você edita os rótulos dos seletores de tamanho (ex.: "TAMANHO DA ROUPA", "TAMANHO DO CALÇADO") sem precisar mexer na lógica da página de produto.

## O que será feito

1. **Criar `src/lib/size-labels.ts`** — arquivo simples com os rótulos por tipo de produto:

   ```ts
   export const SIZE_LABELS = {
     clothing: "TAMANHO DA ROUPA",
     footwear: "TAMANHO",
     kitClothing: "TAMANHO DA ROUPA",
     kitFootwear: "TAMANHO DO CALÇADO",
   };
   ```

   Para alterar qualquer rótulo, basta editar as strings desse arquivo.

2. **Atualizar `src/routes/produtos.$slug.tsx`** — o componente `SizeSelector` passa a importar `SIZE_LABELS` e usar os valores em vez das strings fixas atuais.

Nenhuma mudança em outras páginas, estilos ou comportamento. Só o ponto de leitura dos rótulos muda.

## Como você usa depois

Abrir `src/lib/size-labels.ts`, trocar o texto entre aspas, salvar. O site reflete imediatamente.
