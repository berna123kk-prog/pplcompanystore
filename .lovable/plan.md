## Diagnóstico

Testei o checkout agora no preview clicando em **Gerar PIX** com o produto de R$ 2,00:

- A requisição para `https://api.elitepaybr.com/api/v1/deposit` voltou **HTTP 200**.
- A Elite PAY devolveu `transactionId`, `qrcodeUrl` e `copyPaste` corretamente.
- O QR Code apareceu na tela e o status ficou em "AGUARDANDO PAGAMENTO (PENDING)".

Ou seja: a correção do payload (valor em centavos + `payer.name`/`payer.document` + `paymentMethod: "PIX"`) **resolveu o 500** que você estava vendo.

O 500 que ainda aparece para você é, com altíssima probabilidade, porque você está testando o **site publicado**, que ainda está com a versão antiga do código (anterior à correção).

## O que falta fazer

1. **Republicar o site** para o domínio publicado receber a versão corrigida do checkout.
2. **Reforçar a chamada de verificação de status** (`/api/transactions/check`) — hoje, se a Elite PAY recusar a rota nesse formato, o front fica preso em "AGUARDANDO". Vou:
   - Tentar primeiro `POST /api/v1/transactions/check` e cair para `/api/transactions/check` se a primeira retornar 404, registrando a resposta nos logs para confirmarmos o caminho oficial.
   - Manter o retorno serializável e nunca lançar erro no polling (apenas marcar `UNKNOWN`) para não quebrar a tela.
3. **Mensagens de erro mais claras no botão Gerar PIX**: quando a Elite PAY responder com erro, mostrar o motivo retornado pela API no toast em vez de só "500", para facilitar diagnóstico futuro.
4. **Validar de novo** depois de publicar: gerar um PIX no domínio publicado e conferir que o status muda quando o pagamento for confirmado.

## Detalhes técnicos

- Endpoint de criação: `POST https://api.elitepaybr.com/api/v1/deposit` — confirmado funcionando com payload:
  ```
  { amount: <centavos>, description, payer: { name, document }, paymentMethod: "PIX" }
  ```
- Endpoint de status: `POST https://api.elitepaybr.com/api/transactions/check` — vou logar a resposta bruta na primeira chamada para confirmar o formato exato esperado e o campo de status (`COMPLETO`, `PAID`, `APPROVED`, etc.).
- Sem mudanças de schema do banco; sem novos secrets (as duas chaves `ELITEPAY_CLIENT_ID` e `ELITEPAY_CLIENT_SECRET` já estão configuradas).

## Fora do escopo agora

- Criar webhook `/api/public/elitepay-webhook` para a Elite PAY notificar pagamento sem polling. Posso adicionar em seguida se você quiser.
