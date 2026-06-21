## Status da propagação DNS

Realizei verificação via servidores DNS globais (Google DNS) e o resultado é:

- **Ainda NÃO propagaram** — todos os registros (A e TXT, para raiz e www) retornam status NXDOMAIN (domínio inexistente).
- Isso é normal se você acabou de configurar; propagação DNS pode levar de minutos até **72 horas**.

---

## Como confirmar a verificação

### 1. No painel do projeto (Lovable)
1. Vá em **Configurações do Projeto → Projeto → Domínios**.
2. Procure `pplcompanystore.com` e `www.pplcompanystore.com` na lista.
3. O status indicará:
   - **Verificando** = ainda aguardando propagação.
   - **Configurando** = verificação TXT ok, emitindo SSL.
   - **Ativo** = tudo pronto.
4. Se estiver em "Verificando" há mais de 72h, clique em **Reverificar**.

### 2. No provedor KingHost
1. Acesse o painel de DNS do KingHost para o domínio.
2. Confirme que os registros estão EXATAMENTE assim:
   - **A** → `@` → `185.158.133.1`
   - **A** → `www` → `185.158.133.1`
   - **TXT** → `_lovable` → valor fornecido pelo Lovable
   - **TXT** → `_lovable.www` → valor fornecido pelo Lovable
3. Verifique se não existem registros A antigos conflitantes para `@` ou `www`.
4. Anote o TTL — quanto menor, mais rápida a propagação.

### 3. Ferramentas externas para acompanhar
Você pode usar estes sites para monitorar a propagação:
- **dnschecker.org** — digite `pplcompanystore.com`, selecione tipo A e TXT, e veja em quais servidores mundiais já apareceu.
- **whatsmydns.net** — mesmo propósito, mostra mapa global.

---

## Próximo passo
Aguarde mais um tempo e verifique novamente. Se passarem 72 horas e ainda não propagar, o mais provável é erro na digitação dos valores no KingHost (especialmente o TXT de verificação).