
## Objetivo
Criar uma página interna `/status-dominio` que verifica em tempo real o status de propagação dos registros DNS do domínio `pplcompanystore.com` (e `www.pplcompanystore.com`) e avisa visualmente quando tudo estiver propagado.

## O que será construído

### 1. Server function `checkDomainDns` (`src/lib/dns.functions.ts`)
- Recebe um domínio como entrada.
- Consulta a API pública do Google DNS (`https://dns.google/resolve`) para:
  - Registro **A** de `pplcompanystore.com` → esperado `185.158.133.1`
  - Registro **A** de `www.pplcompanystore.com` → esperado `185.158.133.1`
  - Registro **TXT** de `_lovable.pplcompanystore.com` → deve existir e começar com `lovable_verify=`
  - Registro **TXT** de `_lovable.www.pplcompanystore.com` → idem
- Retorna para cada checagem: `status` (`ok` | `pendente` | `errado`), valor encontrado, valor esperado.

### 2. Página `/status-dominio` (`src/routes/status-dominio.tsx`)
- Header com o domínio e um botão "Verificar agora".
- Lista de 4 cards (um por registro) mostrando:
  - Tipo + nome do registro
  - Valor esperado
  - Valor atual encontrado (ou "ainda não propagado")
  - Ícone de status (✓ verde / ⏳ amarelo / ✗ vermelho)
- Barra de progresso geral (X de 4 registros prontos).
- **Auto-refresh** a cada 30s usando TanStack Query (`refetchInterval`).
- Quando os 4 registros ficarem `ok`:
  - Banner verde "Propagação concluída! Seu domínio está pronto."
  - Toast de sucesso (sonner) disparado uma vez.
- Mensagem explicativa: lembre que mesmo após propagação, o painel Lovable ainda precisa verificar o domínio e emitir SSL.
- Link para abrir Configurações do Projeto (instruções, sem botão direto).

### 3. Metadata SEO
- `head()` com title "Status do domínio — PPL Company Store" e description.
- Página interna, sem necessidade de ser indexada (adicionar `robots: noindex`).

## Detalhes técnicos

- **DNS lookup**: `fetch('https://dns.google/resolve?name=...&type=A')` retorna JSON. Status `0` = sucesso, `3` = NXDOMAIN.
- Server function pública (sem auth), método GET, com input validation via Zod (apenas o domínio raiz, hardcoded para `pplcompanystore.com` por enquanto).
- TanStack Query no componente: `useQuery` com `queryFn` chamando `useServerFn(checkDomainDns)`, `refetchInterval: 30_000`.
- Sem mudanças no backend / DB.
- Sem mudanças em rotas existentes além do `routeTree.gen.ts` (auto-gerado).

## Fora de escopo
- Não conecta ao painel Lovable via API (não há endpoint público).
- Não emite SSL nem altera DNS no KingHost.
- Não envia e-mail/notificação push quando propagar — apenas banner e toast na página.
