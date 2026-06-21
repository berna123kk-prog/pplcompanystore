# Conectar Domínio Personalizado: pplcompanystore.com

## O que será feito
Conectar o domínio `pplcompanystore.com` (e `www.pplcompanystore.com`) ao projeto publicado no Lovable, configurando os registros DNS necessários no provedor KingHost.

---

## Passo a passo para você executar

### 1. No painel do Lovable (você deve fazer isso)
- Vá em **Project Settings → Project → Domains**
- Clique em **Connect Domain**
- Adicione **dois domínios** separadamente:
  - `pplcompanystore.com` (raiz)
  - `www.pplcompanystore.com` (www)
- Anote os valores que o Lovable mostrar para:
  - **A Record** → valor: `185.158.133.1`
  - **TXT Record** → valor de verificação: `lovable_verify=...` (esse é único por domínio)

### 2. No painel da KingHost (você deve fazer isso)
Acesse a zona DNS do seu domínio e crie os seguintes registros:

**Para o domínio raiz (`pplcompanystore.com`):**
| Tipo | Nome/Host | Valor |
|------|-----------|-------|
| A | @ | 185.158.133.1 |
| TXT | _lovable | (valor fornecido pelo Lovable) |

**Para o subdomínio `www` (`www.pplcompanystore.com`):**
| Tipo | Nome/Host | Valor |
|------|-----------|-------|
| A | www | 185.158.133.1 |
| TXT | _lovable.www | (valor fornecido pelo Lovable) |

> **Importante:** Não mantenha outros registros A ou CNAME conflitantes para `@` e `www` apontando para outro lugar. Remova ou atualize registros antigos.

### 3. Depois de configurar os DNS
- Volte ao painel do Lovable e clique em **Verify** para cada domínio.
- A propagação DNS pode levar de alguns minutos até **72 horas**.
- Quando verificado, o Lovable provisionará o SSL (HTTPS) automaticamente.
- Escolha um dos domínios como **Primary** — o outro redirecionará para ele.

---

## Observações
- O projeto já está publicado em `pplcompanystore.lovable.app`, então o domínio customizado pode ser conectado.
- Os valores exatos do TXT de verificação (`lovable_verify=...`) são gerados pelo Lovable no momento da configuração e eu não tenho acesso a eles. Você precisa copiá-los do painel.
- Se quiser, você pode comprar o domínio diretamente pelo Lovable (em planos pagos) e essa configuração manual de DNS não será necessária.