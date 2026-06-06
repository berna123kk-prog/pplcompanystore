#!/usr/bin/env node
/**
 * Vite Watchdog
 *
 * Monitora o log do dev server do Vite e reinicia automaticamente
 * quando detecta falhas de re-otimização de dependências (504 em
 * /node_modules/.vite/deps/*, ERR_OUTDATED_OPTIMIZED_DEP, etc.).
 *
 * Uso: node scripts/vite-watchdog.mjs
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LOG_FILE = "/tmp/dev-server-logs/dev-server.log";
const SQLITE_DB = "/tmp/sandbox-state.db";
const OUT_LOG = "/tmp/vite-watchdog.log";

const TRIGGERS = [
  /504\s*\(?Outdated Optimize Dep\)?/i,
  /ERR_OUTDATED_OPTIMIZED_DEP/i,
  /Failed to reload/i,
  /optimized dependencies changed\.?\s*reloading/i,
  /Pre-transform error/i,
  /504 .* \/node_modules\/\.vite\/deps\//i,
];

const DEBOUNCE_MS = 5_000;
const COOLDOWN_MS = 30_000;
const WINDOW_MS = 10 * 60_000;
const MAX_RESTARTS_IN_WINDOW = 5;

let lastRestart = 0;
let pendingTimer = null;
const restarts = []; // timestamps

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try {
    mkdirSync(dirname(OUT_LOG), { recursive: true });
    appendFileSync(OUT_LOG, line);
  } catch {}
}

function withinLimit() {
  const now = Date.now();
  while (restarts.length && now - restarts[0] > WINDOW_MS) restarts.shift();
  return restarts.length < MAX_RESTARTS_IN_WINDOW;
}

function restartVite() {
  const now = Date.now();
  if (now - lastRestart < COOLDOWN_MS) {
    log("skip restart: cooldown ativo");
    return;
  }
  if (!withinLimit()) {
    log(`circuit breaker: ${MAX_RESTARTS_IN_WINDOW} restarts em ${WINDOW_MS / 60000}min; aguardando`);
    return;
  }
  lastRestart = now;
  restarts.push(now);
  log("reiniciando dev server (pkill -f vite)");
  const res = spawnSync("pkill", ["-f", "vite"], { encoding: "utf8" });
  if (res.status !== 0 && res.status !== 1) {
    log(`pkill falhou: ${res.stderr || res.status}`);
  } else {
    log("processo do vite encerrado; supervisor do sandbox deve subir novamente");
  }
}

function schedule() {
  if (pendingTimer) return;
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    restartVite();
  }, DEBOUNCE_MS);
}

function handleLine(line) {
  for (const re of TRIGGERS) {
    if (re.test(line)) {
      log(`gatilho: ${re} | linha: ${line.slice(0, 200)}`);
      schedule();
      return;
    }
  }
}

function tailFile() {
  log(`tail -F ${LOG_FILE}`);
  const tail = spawn("tail", ["-n", "0", "-F", LOG_FILE]);
  let buf = "";
  tail.stdout.on("data", (chunk) => {
    buf += chunk.toString();
    let idx;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      handleLine(line);
    }
  });
  tail.on("exit", (code) => {
    log(`tail saiu com código ${code}; nova tentativa em 3s`);
    setTimeout(start, 3000);
  });
}

let lastId = 0;
function pollSqlite() {
  log(`polling sqlite ${SQLITE_DB} (daemon=vite)`);
  // bootstrap: ignora histórico, começa do maior id atual
  const init = spawnSync("sqlite3", [
    SQLITE_DB,
    "SELECT COALESCE(MAX(id),0) FROM daemon_logs WHERE daemon_name='vite';",
  ], { encoding: "utf8" });
  if (init.status === 0) lastId = parseInt(init.stdout.trim() || "0", 10) || 0;

  setInterval(() => {
    const res = spawnSync("sqlite3", [
      "-separator", "\t",
      SQLITE_DB,
      `SELECT id, content FROM daemon_logs WHERE daemon_name='vite' AND id > ${lastId} ORDER BY id ASC LIMIT 500;`,
    ], { encoding: "utf8" });
    if (res.status !== 0) return;
    const lines = res.stdout.split("\n").filter(Boolean);
    for (const row of lines) {
      const tab = row.indexOf("\t");
      if (tab < 0) continue;
      const id = parseInt(row.slice(0, tab), 10);
      const content = row.slice(tab + 1);
      if (Number.isFinite(id) && id > lastId) lastId = id;
      handleLine(content);
    }
  }, 2000);
}

function start() {
  if (existsSync(LOG_FILE)) {
    tailFile();
  } else if (existsSync(SQLITE_DB)) {
    pollSqlite();
  } else {
    log("nenhuma fonte de log encontrada; nova tentativa em 5s");
    setTimeout(start, 5000);
  }
}

log("vite-watchdog iniciado");
start();
