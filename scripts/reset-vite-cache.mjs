#!/usr/bin/env node
/**
 * Limpa o cache do Vite e reinicia o dev server.
 *
 * Uso:
 *   bun run dev:reset         # limpa o cache e encerra (o sandbox reinicia o Vite sozinho)
 *   bun run dev:reset --run   # limpa o cache e sobe `vite dev` no foreground
 *
 * Quando rodando localmente fora do sandbox, prefira `--run`. Dentro do
 * sandbox da Lovable o supervisor reinicia o Vite automaticamente após a
 * limpeza, então basta executar sem argumentos.
 */
import { rmSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  "node_modules/.vite",
  "node_modules/.vite-temp",
  ".vite",
];

let removed = 0;
for (const rel of targets) {
  const abs = resolve(root, rel);
  if (existsSync(abs)) {
    rmSync(abs, { recursive: true, force: true });
    console.log(`[vite-reset] removido ${rel}`);
    removed++;
  }
}
if (removed === 0) console.log("[vite-reset] nenhum cache encontrado, nada a remover.");

if (process.argv.includes("--run")) {
  console.log("[vite-reset] iniciando `vite dev`...");
  const child = spawn("bunx", ["vite", "dev"], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  console.log("[vite-reset] cache limpo. O dev server será reiniciado pelo supervisor.");
}
