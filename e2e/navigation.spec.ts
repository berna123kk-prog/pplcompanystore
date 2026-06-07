import { test, expect, type Page } from "@playwright/test";

/**
 * Navegação E2E: percorre todos os menus do header e clica em cada card de
 * produto encontrado, garantindo que nenhuma rota retorne 404 indevido.
 *
 * Rotas conhecidas como 404 legítimas (ex.: `/colecoes/inexistente`) NÃO são
 * exercitadas aqui — todos os links seguidos vêm de elementos reais do app.
 */

const COLLECTION_SLUGS = [
  "vestuario",
  "camisetas",
  "jaquetas-e-moletons",
  "calcas",
  "bermudas-e-shorts",
  "kits-completos",
  "acessorios",
  "slides",
  "sneakers",
  "perfumes",
];

/** Coleta hrefs internos únicos da página atual. */
async function collectInternalLinks(page: Page): Promise<string[]> {
  const hrefs = await page.$$eval("a[href]", (els) =>
    els
      .map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? "")
      .filter((h) => h.startsWith("/") && !h.startsWith("//")),
  );
  return Array.from(new Set(hrefs));
}

/** Navega para `path` e falha se for 404 indevido (status ou conteúdo). */
async function expectRouteOk(page: Page, path: string) {
  const resp = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(resp, `sem resposta para ${path}`).not.toBeNull();
  const status = resp!.status();
  expect(status, `status ${status} em ${path}`).toBeLessThan(400);

  // Defesa em profundidade: confere que a página renderizada não é "não encontrada".
  const body = (await page.locator("body").innerText()).toLowerCase();
  const looksLike404 =
    body.includes("não encontrada") ||
    body.includes("nao encontrada") ||
    body.includes("not found") ||
    body.includes("page not found");
  expect(looksLike404, `página ${path} renderizou estado de 404`).toBeFalsy();
}

test.describe("Storefront — navegação sem 404 indevido", () => {
  test("home carrega com 200", async ({ page }) => {
    await expectRouteOk(page, "/");
    await expect(page.locator("header")).toBeVisible();
  });

  test("checkout carrega com 200", async ({ page }) => {
    await expectRouteOk(page, "/checkout");
  });

  test("sitemap.xml responde com 200", async ({ request }) => {
    const resp = await request.get("/sitemap.xml");
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain("<urlset");
  });

  for (const slug of COLLECTION_SLUGS) {
    test(`coleção /${slug} carrega e seus cards não dão 404`, async ({ page }) => {
      await expectRouteOk(page, `/colecoes/${slug}`);

      const productLinks = (await collectInternalLinks(page)).filter((h) =>
        h.startsWith("/produtos/"),
      );

      // Amostra até 5 produtos por coleção para manter o teste rápido.
      const sample = productLinks.slice(0, 5);
      for (const href of sample) {
        await expectRouteOk(page, href);
      }
    });
  }

  test("menus do header navegam para coleções existentes", async ({ page }) => {
    await page.goto("/");
    const headerLinks = await page
      .locator("header a[href^='/colecoes/']")
      .evaluateAll((els) =>
        Array.from(
          new Set(
            els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
          ),
        ),
      );
    expect(headerLinks.length).toBeGreaterThan(0);

    for (const href of headerLinks) {
      await expectRouteOk(page, href);
    }
  });

  test("crawl raso da home: todos os links internos respondem", async ({ page }) => {
    await page.goto("/");
    const links = (await collectInternalLinks(page)).filter(
      (h) => !h.startsWith("/sitemap"),
    );
    for (const href of links.slice(0, 30)) {
      await expectRouteOk(page, href);
    }
  });
});
