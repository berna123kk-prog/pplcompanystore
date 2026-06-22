# Edição inline de tamanhos esgotados (com login admin)

## Como vai funcionar pra você

1. Você cria sua conta admin uma única vez em **`/auth`** (e-mail/senha ou Google).
2. Como ainda não existe nenhum admin no sistema, clicar em **"Tornar-me admin"** logo após o login concede o cargo a você (só funciona enquanto não houver outro admin — depois disso só admins existentes promovem novos).
3. Na página de qualquer produto, logada(o) como admin, aparece o botão **"Editar estoque"** ao lado dos tamanhos. Ao ativar, clicar num tamanho alterna entre **disponível ↔ esgotado (riscado)**. Cada clique salva automaticamente no backend e fica visível pra todos os visitantes, em qualquer dispositivo.
4. Visitantes comuns continuam vendo o produto normalmente, com os tamanhos esgotados riscados e desabilitados.

## O que será criado

### Backend
- Tabela `user_roles` + enum `app_role` + função `has_role()` (padrão seguro, sem recursão de RLS).
- Tabela `product_size_overrides` (`product_slug` PK, `sold_out_sizes text[]`, `updated_at`):
  - **SELECT público** (anon + authenticated) — todos veem os tamanhos riscados.
  - **INSERT/UPDATE/DELETE** apenas pra quem tem `role = 'admin'`.
- Função RPC `claim_first_admin()` que concede admin ao usuário logado SE ainda não houver nenhum admin (idempotente, segura).
- Auth ativado com **e-mail/senha + Google** (sem auto-confirm de e-mail).

### Server functions (`src/lib/admin.functions.ts`)
- `getSizeOverrides()` — leitura pública (publishable key), retorna todos os overrides.
- `setSoldOutSizes({ slug, sizes })` — protegido por `requireSupabaseAuth` + checagem `has_role(uid,'admin')`, faz upsert.
- `claimFirstAdmin()` — chama a RPC acima.
- `getMyRole()` — retorna se o usuário atual é admin (pra UI saber se mostra o botão).

### Frontend
- `src/routes/auth.tsx` — página de login/cadastro (e-mail/senha + Google), com botão "Tornar-me admin" visível só quando logado.
- `src/routes/produtos.$slug.tsx`:
  - Carrega overrides via TanStack Query no loader (público).
  - Mescla `product.soldOutSizes` (código) com os do banco — banco tem prioridade.
  - Se admin: botão "Editar estoque" que entra em modo edição; clicar num tamanho dispara mutation e atualiza otimisticamente.
  - Adiciona link discreto "Admin" no menu/header pra ir pra `/auth`.

## Fora de escopo

- Sem painel de admin geral (só edição inline no produto).
- Sem perfis de usuário (username/avatar) — só o cargo `admin`.
- Sem reset de senha agora (posso adicionar depois).
- Não mexe em carrinho, checkout, pagamentos.

## Observação importante

Depois que a migração for aprovada, você precisa:
1. Acessar `/auth`, criar a conta.
2. Clicar em **"Tornar-me admin"** uma vez.
3. Voltar pra qualquer produto e usar "Editar estoque".
