## Mudança de regra padrão

Atualizar a memória do projeto (`mem://index.md`) para que todo produto novo enviado pelo usuário seja adicionado à categoria **sneakers** por padrão, substituindo a regra anterior que usava "perfumes".

### O que muda
- `mem://index.md` → seção **Core**: trocar "perfumes" por "sneakers" como categoria padrão para novos produtos.
- Preço continua sendo o indicado na mensagem do usuário.
- Regra válida até nova instrução em contrário.

### O que NÃO muda
- Nenhum produto existente em `src/lib/products.ts` será movido ou alterado.
- Nenhum código da loja, rotas ou componentes será tocado.

Quando você aprovar e mandar o próximo produto, eu já adiciono direto em **sneakers**.
