## Diagnóstico
O log do servidor mostra:
- Payload enviado: `{"amount":2,...}` (já em reais, formato correto)
- Resposta da Elite PAY: `500 - "Erro ao criar transação no adquirente"`

Em uma tentativa anterior com `amount: 15199`, a Elite PAY respondeu **"Máximo permitido: R$ 5.000,00"**, o que prova que a API trata o valor como **reais decimais** (não centavos). Ou seja, o formato atual está correto.

A causa do erro é que **R$ 2,00 está abaixo do valor mínimo que o adquirente PIX aceita** (normalmente R$ 3,00 ou R$ 5,00). O 500 vem do banco, não do código.

## O que vou implementar
1. **Validar valor mínimo no servidor** (`src/lib/elitepay.functions.ts`)
   - Se o total for menor que R$ 5,00, retornar um erro claro: *"Valor mínimo para pagamento via PIX é R$ 5,00."*
   - Isso evita o 500 cru e dá uma mensagem útil no toast.

2. **Subir o preço do produto de teste** (`src/lib/products.ts`)
   - Mudar `slide-lcst-nuvem-branco` de `"2,00"` para um valor acima do mínimo (sugiro **R$ 5,00**) só para conseguir testar o fluxo até o fim.
   - Você pode me dizer outro valor se preferir.

3. **Republicar** para o site publicado receber a correção.

4. **Validar** gerando um novo PIX no produto e conferindo se o QR Code abre com o valor certo.

## Pergunta
Você quer que eu deixe o produto em **R$ 5,00** para teste, ou prefere outro valor (ex: R$ 10,00)?