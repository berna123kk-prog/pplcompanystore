# scripts/

## vite-watchdog.mjs

Monitora o log do dev server do Vite e reinicia automaticamente o processo
quando detecta falhas de re-otimização de dependências, como:

- `504 (Outdated Optimize Dep)` em `/node_modules/.vite/deps/*`
- `ERR_OUTDATED_OPTIMIZED_DEP`
- `Failed to reload`
- `optimized dependencies changed. reloading`
- `Pre-transform error`

### Como usar

Em background:

```bash
node scripts/vite-watchdog.mjs >/tmp/vite-watchdog.out 2>&1 &
```

Ou via npm script (já incluso no `package.json`):

```bash
bun run watchdog
```

### Comportamento

- Debounce de 5s para agrupar erros em sequência.
- Cooldown de 30s entre reinícios.
- Circuit breaker: no máximo 5 reinícios em 10 minutos.
- Restart feito via `pkill -f vite` — o supervisor do sandbox sobe o Vite
  novamente automaticamente.
- Logs do próprio watcher em `/tmp/vite-watchdog.log`.

### Fontes de log monitoradas

1. `/tmp/dev-server-logs/dev-server.log` (preferida, via `tail -F`).
2. Fallback: `/tmp/sandbox-state.db` (tabela `daemon_logs`, daemon `vite`)
   via polling com `sqlite3` a cada 2s.
