## Objetivo
Fazer o PIX sempre sair com o mesmo valor do produto exibido na loja — no seu caso, o item de R$ 2,00 deve gerar QR Code de R$ 2,00, nunca R$ 200,00.

## O que vou implementar
1. **Tornar o valor do PIX confiável no servidor**
   - Parar de confiar no `amount` enviado pelo checkout.
   - Recalcular o total no servidor com base nos itens/slug do produto e quantidade.

2. **Corrigir o formato enviado para a Elite PAY**
   - Ajustar o payload para enviar o valor no formato que a API está interpretando corretamente.
   - Remover a conversão que hoje transforma `2` em `200` dentro do fluxo de depósito.

3. **Ajustar o checkout para enviar só os dados necessários**
   - O frontend vai mandar apenas identificação dos itens e dados do pagador.
   - O backend calcula o total final antes de gerar o PIX.

4. **Validar o fluxo do produto de R$ 2,00**
   - Testar geração do PIX com o produto `slide-lcst-nuvem-branco`.
   - Confirmar que o QR Code e o valor retornado ficam alinhados com o preço mostrado no pedido.

## Arquivos envolvidos
- `src/lib/elitepay.functions.ts`
- `src/routes/checkout.tsx`
- `src/lib/products.ts` (como fonte confiável do preço)
- possivelmente `src/lib/cart.tsx` apenas se precisar ajustar o formato dos dados enviados

## Detalhes técnicos
- O cálculo do carrinho já está interpretando `"2,00"` corretamente como `2`.
- O problema atual está no servidor, em `createDeposit`, onde o valor está sendo convertido com `Math.round(data.amount * 100)` antes de enviar para a Elite PAY.
- Isso faz o produto de R$ 2,00 virar `200` no payload, e a API passa a gerar o PIX com R$ 200,00.
- Além da correção imediata, vou deixar a cobrança protegida contra manipulação do valor no cliente.

## Resultado esperado
- Produto de R$ 2,00 gera PIX de R$ 2,00.
- O valor cobrado sempre bate com o valor do produto/carrinho.
- O checkout fica mais seguro e consistente.