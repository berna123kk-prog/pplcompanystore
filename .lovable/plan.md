## Objetivo

Substituir a página `/checkout` atual por um fluxo em **3 etapas numeradas** (Identifique-se → Entrega → Pagamento), no estilo das imagens enviadas, mantendo o checkout como convidado (sem cadastro) e sem persistir dados em banco. O PIX continua sendo gerado pelo Elite PAY como já é feito hoje.

## Layout (estilo das imagens)

```text
┌───────────────────────────┐  ┌──────────────────────────┐
│ [1] Identifique-se        │  │ [3] Pagamento            │
│  Nome / E-mail / CPF /    │  │ (bloqueado até passo 2)  │
│  Celular  → [Continuar]   │  │                          │
└───────────────────────────┘  └──────────────────────────┘
┌───────────────────────────┐
│ [2] Entrega               │
│  CEP → endereço (ViaCEP)  │
│  Opções de frete Correios │
│  → [Continuar]            │
└───────────────────────────┘
```

- Cada card mostra número em quadrado escuro + título; quando concluído vira verde com check (igual às telas).
- Etapas seguintes ficam visualmente desabilitadas até a anterior ser concluída.
- À direita, resumo do pedido com itens, subtotal, frete e total (já existe parcialmente).
- Botão "Editar" (lápis) em cada etapa concluída para voltar e ajustar.
- Estilo visual mantém o tema atual do site (azul/sky); botões "Continuar" em azul escuro arredondados e "Finalizar agora" em verde, como nas imagens.

## Etapa 1 — Identifique-se

Campos: **Nome completo**, **E-mail**, **CPF** (com máscara), **Celular/WhatsApp** (com máscara `+55 (DD) 9XXXX-XXXX`).
Validação com Zod no submit. Ao clicar Continuar, fecha o card e mostra resumo (nome, e-mail, CPF) + ícone de editar.

## Etapa 2 — Entrega

1. Campo **CEP** com máscara `00000-000`.
2. Ao completar 8 dígitos, chama **ViaCEP** (`https://viacep.com.br/ws/{cep}/json/`) e preenche rua, bairro, cidade, UF.
3. Campos editáveis: rua, número, complemento, bairro, cidade, UF.
4. Em paralelo ao retorno do CEP, chama uma **server function nova** `getShippingOptions` que consulta os **Correios reais** e devolve as opções:
   - Correios PAC (com prazo)
   - Correios Sedex (com prazo)
5. Usuário escolhe uma opção (radio cards), clica Continuar.

> Observação sobre Correios: a antiga API pública dos Correios foi descontinuada. Vou implementar via um provider gratuito amplamente usado (ex.: `frenet`/`melhorenvio`/`brasilapi`) que repassa as tarifas oficiais. Isso exige **uma chave/credencial gratuita** — vou pedir somente se necessário ao implementar; se não houver, deixo um fallback transparente que mostra PAC/Sedex com valores estimados e marca como "estimado".

## Etapa 3 — Pagamento

Mostra apenas **PIX** (como nas imagens), valor total = itens + frete escolhido.
Botão verde **"Finalizar agora"** chama `createDeposit` (já existente) passando os itens + nome + CPF do usuário. Após gerar, exibe QR Code + Copia e Cola + status, como já está implementado hoje.

## Detalhes técnicos

- Refatorar `src/routes/checkout.tsx` em um componente principal + 3 sub-componentes (`StepIdentify`, `StepDelivery`, `StepPayment`) no mesmo arquivo (ou em `src/components/checkout/`).
- Estado local com `useState` para `step` (1|2|3), `customer`, `address`, `shipping`.
- ViaCEP é chamado direto do browser (API pública, CORS liberado).
- Nova server function `src/lib/shipping.functions.ts` → `getShippingOptions({ cepDestino, items })`. Calcula peso total a partir dos itens e devolve `[{ service: "PAC", price, days }, { service: "SEDEX", price, days }]`.
- Atualizar `createDeposit` para aceitar opcionalmente `shippingAmount` somado ao total (mantém validação server-side de preço, sem confiar no cliente).
- O resumo do pedido passa a mostrar linha **Frete** quando definido.
- Sem alterações de banco; sem login.
- Mobile: cards empilham em coluna única.

## O que NÃO muda

- `products.ts`, páginas de produto, sacola, integrações Elite PAY existentes.
- Memória do projeto (novos produtos continuam indo para "sneakers").
