import { test, expect, type Page } from "@playwright/test";

/**
 * Suíte de UI real com browser: clica nos menus do header e em cards de
 * produto e garante ausência de 404 indevido.
 *
 * Desativada por padrão (requer libs nativas do Chromium no host). Ative com:
 *   BROWSER_E2E=1 bunx playwright install --with-deps chromium
 *   BROWSER_E2E=1 bunx playwright test e2e/navigation.browser.spec.ts
 */

const ENABLED = process.env.BROWSER_E2E === "1";

test.describe(ENABLED ? "Storefront — cliques reais via browser" : "Storefront — cliques reais via browser (desativado)", () => {
  test.skip(!ENABLED, "Defina BROWSER_E2E=1 e instale Chromium para rodar.");

  async function assertNot404(page: Page) {
    const body = (await page.locator("body").innerText()).toLowerCase();
    const bad =
      body.includes("não encontrada") ||
      body.includes("nao encontrada") ||
      body.includes("page not found");
    expect(bad).toBeFalsy();
  }

  test("clica em cada menu do header", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("header a[href^='/colecoes/']")
      .evaluateAll((els) =>
        Array.from(
          new Set(
            els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
          ),
        ),
      );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await page.goto(href);
      await assertNot404(page);
    }
  });

  test("clica nos cards de produto da coleção sneakers", async ({ page }) => {
    await page.goto("/colecoes/sneakers");
    const cards = await page
      .locator("a[href^='/produtos/']")
      .evaluateAll((els) =>
        Array.from(
          new Set(
            els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
          ),
        ),
      );
    for (const href of cards.slice(0, 5)) {
      await page.goto(href);
      await assertNot404(page);
    }
  });
});
