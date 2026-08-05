Criar o cupom **PPL50PP** com 50% de desconto no catálogo de cupons da loja.

### O que será feito
1. Abrir `src/lib/coupons.ts`.
2. Adicionar um novo item na lista `COUPONS`:
   - `code`: "PPL50PP"
   - `label`: "50% OFF"
   - `type`: "percent"
   - `value`: 50
3. Garantir que não há outro cupom com o mesmo código.

### Como funciona
O checkout (`src/routes/checkout.tsx`) e o cálculo do PIX (`src/lib/elitepay.functions.ts`) já usam `findCoupon` e `calcDiscount` para aplicar descontos percentuais. Portanto, apenas adicionar o cupom à lista é suficiente para que ele funcione no campo "Inserir cupom de desconto" do checkout.

### Validação
- Typecheck com `bunx tsc --noEmit` ou `tsgo` (se disponível).
- Acessar o checkout, inserir `PPL50PP` e verificar se o desconto de 50% é aplicado ao subtotal.