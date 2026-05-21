## Problema identificado
O PIX está sendo gerado corretamente no backend, mas o pagamento está sendo recusado no app do banco do pagador com a mensagem de suspeita de golpe.

Evidências já confirmadas:
- A cobrança de **R$ 5,00** foi criada com sucesso.
- O backend recebeu **status 200** da Elite PAY e retornou `transactionId` + `copyPaste`.
- A transação ficou como **PENDENTE**, ou seja, o QR foi criado, mas o banco do cliente não concluiu a transferência.
- A tela enviada por você é do **app do banco bloqueando a transferência por antifraude**, não um erro interno do site.

## O que vou implementar
1. **Ajustar a mensagem do checkout**
   - Trocar o erro genérico por uma orientação clara quando o PIX for gerado mas o pagamento não for concluído.
   - Informar que, em alguns bancos, a transferência pode ser bloqueada por análise antifraude.

2. **Exibir melhor os dados do PIX gerado**
   - Mostrar com clareza o valor, status e código PIX gerado.
   - Manter o acompanhamento automático do status da cobrança para evitar dúvida se o pedido foi criado ou não.

3. **Tratar o cenário de bloqueio como caso operacional, não erro técnico**
   - Separar “falha ao gerar PIX” de “PIX gerado, mas banco recusou pagar”.
   - Evitar que o usuário ache que o site quebrou quando, na prática, o bloqueio veio do banco emissor.

4. **Validar no fluxo publicado**
   - Conferir se o site publicado está usando a versão nova do cálculo e do checkout.
   - Confirmar que novas tentativas continuam criando a cobrança corretamente.

## Observação importante
Pelo diagnóstico atual, o problema principal não parece mais ser no código do valor nem na geração do QR. O bloqueio parece ser do **banco que está tentando pagar**, provavelmente por regra antifraude da conta recebedora ou do intermediador.

## Detalhes técnicos
- Arquivos mais prováveis no fluxo:
  - `src/lib/elitepay.functions.ts`
  - `src/routes/checkout.tsx`
  - `src/start.ts`
- Também encontrei um ajuste técnico separado a fazer no app:
  - `src/start.ts` não está com o middleware global de autenticação anexado, e há um erro de runtime no preview relacionado ao carregamento do client entry. Vou revisar isso sem expandir o escopo do checkout.

## Resultado esperado
Depois da implementação, o usuário verá claramente quando:
- o PIX **foi gerado com sucesso**, e
- o pagamento **foi bloqueado pelo banco**, sem confundir isso com erro do site.