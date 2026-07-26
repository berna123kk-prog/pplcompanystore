#!/usr/bin/env node
/**
 * Guarda de catálogo.
 *
 * Impede que edições em massa (sed, replace global, etc.) removam produtos
 * de uma categoria sem querer. Compara a contagem atual de produtos em
 * src/lib/products.ts com a baseline em scripts/catalog-baseline.json.
 *
 * Uso:
 *   node scripts/catalog-guard.mjs            # valida (exit 1 se houver perda)
 *   node scripts/catalog-guard.mjs --update   # grava a baseline atual
 *   node scripts/catalog-guard.mjs --tolerance 0   # perda máxima permitida (padrão 0)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const PRODUCTS = join(here, "..", "src", "lib", "products.ts");
const BASELINE = join(here, "catalog-baseline.json");

const args = process.argv.slice(2);
const update = args.includes("--update");
const tIdx = args.indexOf("--tolerance");
const tolerance = tIdx >= 0 ? Number(args[tIdx + 1] ?? 0) : 0;

function collect() {
  const src = readFileSync(PRODUCTS, "utf8");
  const categories = {};
  for (const m of src.matchAll(/category:\s*"([^"]+)"/g)) {
    categories[m[1]] = (categories[m[1]] ?? 0) + 1;
  }
  const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return { categories, totalSlugs: slugs.length, slugs };
}

const current = collect();

if (update) {
  writeFileSync(
    BASELINE,
    JSON.stringify(
      { updatedAt: new Date().toISOString(), categories: current.categories, totalSlugs: current.totalSlugs },
      null,
      2,
    ) + "\n",
  );
  console.log("Baseline do catálogo atualizada:", BASELINE);
  console.table(current.categories);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.error("Baseline não encontrada. Rode: node scripts/catalog-guard.mjs --update");
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
const problems = [];

for (const [cat, count] of Object.entries(baseline.categories)) {
  const now = current.categories[cat] ?? 0;
  if (now < count - tolerance) {
    problems.push(`categoria "${cat}": ${count} → ${now} (${count - now} produto(s) removido(s))`);
  }
}

if (current.totalSlugs < baseline.totalSlugs - tolerance) {
  problems.push(
    `total de produtos: ${baseline.totalSlugs} → ${current.totalSlugs} (${baseline.totalSlugs - current.totalSlugs} removido(s))`,
  );
}

const dupes = current.slugs.filter((s, i) => current.slugs.indexOf(s) !== i);
if (dupes.length) problems.push(`slugs duplicados: ${[...new Set(dupes)].join(", ")}`);

if (problems.length) {
  console.error("\n❌ Validação do catálogo falhou:\n");
  for (const p of problems) console.error("  - " + p);
  console.error(
    "\nSe a remoção foi intencional, confirme com: node scripts/catalog-guard.mjs --update\n",
  );
  process.exit(1);
}

const added = Object.entries(current.categories)
  .filter(([c, n]) => n > (baseline.categories[c] ?? 0))
  .map(([c, n]) => `${c} +${n - (baseline.categories[c] ?? 0)}`);

console.log("✅ Catálogo íntegro." + (added.length ? " Novos: " + added.join(", ") : ""));
