## Objetivo

Criar um watcher que monitora os logs do dev server do Vite e, ao detectar falha de re-otimização de dependências (ex.: respostas 504 em `/node_modules/.vite/deps/*`, mensagens como "Failed to reload", "optimized dependencies changed", "504 Outdated Optimize Dep"), reinicia automaticamente o dev server.

## Arquivos a criar

1. `scripts/vite-watchdog.mjs`
   - Script Node standalone (sem dependências externas).
   - Faz `tail -f` em `/tmp/dev-server-logs/dev-server.log` (fallback: lê de `/tmp/sandbox-state.db` via `sqlite3` se o arquivo não existir).
   - Padrões de gatilho (regex):
     - `504 \(Outdated Optimize Dep\)`
     - `Failed to reload`
     - `optimized dependencies changed. reloading`
     - `ERR_OUTDATED_OPTIMIZED_DEP`
     - `Pre-transform error`
   - Debounce de 5s para evitar restart em loop.
   - Cooldown de 30s entre restarts; máximo 5 restarts em 10 min (circuit breaker que apenas loga e para de reiniciar).
   - Ação de restart: chama o daemon do sandbox via `sqlite3 /tmp/sandbox-state.db` marcando `vite` para restart, ou executa `pkill -f "vite"` deixando o supervisor do sandbox subir novamente.

2. `scripts/README.md` — instruções curtas de uso.

## Como rodar

- Manual: `node scripts/vite-watchdog.mjs &` (background).
- Opcional: adicionar um script em `package.json`: `"watchdog": "node scripts/vite-watchdog.mjs"`.
- Não inicia automaticamente junto com o dev server (o sandbox gerencia o ciclo do Vite); fica como ferramenta para ativar quando o problema ressurgir.

## Detalhes técnicos

```text
[tail log] --> [match regex] --> [debounce 5s]
                                      |
                                      v
                          [cooldown ok? & under limit?]
                                 |yes        |no
                                 v           v
                            [restart]     [log skip]
```

- Sem alterações em `vite.config.ts` (proibido adicionar plugins duplicados).
- Sem mudanças em código de aplicação (`src/`), rotas ou produtos.
- Saída do watcher gravada em `/tmp/vite-watchdog.log`.

## Fora do escopo

- Mudar configurações do Vite ou `optimizeDeps`.
- Tocar em qualquer arquivo da loja (produtos, preços, UI).
