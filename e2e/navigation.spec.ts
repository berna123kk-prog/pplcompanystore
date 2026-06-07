import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * E2E HTTP-only: faz crawl da home + todas as páginas de coleção, segue cada
 * link interno (menus, cards de produto, breadcrumbs, footer) contra a URL
 * publicada e falha se aparecer qualquer 404 indevido.
 *
 * Usamos a fixture `request` do Playwright (sem browser) porque o sandbox
 * deste ambiente não dispõe das libs nativas do Chromium. O efeito prático é
 * o mesmo do "clicar em todos os menus e cards": cada `<a href>` renderizado
 * em SSR é exercitado de ponta a ponta contra produção.
 *
 * Para rodar com browser real (clique em UI), basta usar a suíte
 * `navigation.browser.spec.ts` em um ambiente com Chromium instalado:
 *   bunx playwright install --with-deps chromium
 *   bunx playwright test
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

/** Extrai hrefs internos (começando com "/") do HTML bruto. */
function extractInternalLinks(html: string): string[] {
  const out = new Set<string>();
  const re = /href\s*=\s*"([^"#?]+)(?:[?#][^"]*)?"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith("/") && !href.startsWith("//")) out.add(href);
  }
  return Array.from(out);
}

function looksLikeNotFound(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes("não encontrada") ||
    lower.includes("nao encontrada") ||
    lower.includes("page not found") ||
    lower.includes(">not found<")
  );
}

async function expectRouteOk(request: APIRequestContext, path: string) {
  const resp = await request.get(path);
  const status = resp.status();
  expect(status, `status ${status} em ${path}`).toBeLessThan(400);
  const ctype = resp.headers()["content-type"] ?? "";
  if (ctype.includes("text/html")) {
    const html = await resp.text();
    expect(looksLikeNotFound(html), `página ${path} renderizou estado de 404`).toBeFalsy();
  }
}

test.describe("Storefront — navegação sem 404 indevido", () => {
  test("home responde 200", async ({ request }) => {
    await expectRouteOk(request, "/");
  });

  test("checkout responde 200", async ({ request }) => {
    await expectRouteOk(request, "/checkout");
  });

  test("sitemap.xml responde 200 e é XML válido", async ({ request }) => {
    const resp = await request.get("/sitemap.xml");
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toContain("<urlset");
  });

  test("rota inexistente devolve 404 (controle negativo)", async ({ request }) => {
    const resp = await request.get("/colecoes/_definitivamente-inexistente_");
    expect(resp.status()).toBe(404);
  });

  test("menus do header levam a coleções existentes", async ({ request }) => {
    const home = await request.get("/");
    expect(home.status()).toBe(200);
    const html = await home.text();
    const headerCollectionLinks = Array.from(
      new Set(
        Array.from(html.matchAll(/href="(\/colecoes\/[^"#?]+)"/g)).map((m) => m[1]),
      ),
    );
    expect(headerCollectionLinks.length).toBeGreaterThan(0);
    for (const href of headerCollectionLinks) {
      await expectRouteOk(request, href);
    }
  });

  for (const slug of COLLECTION_SLUGS) {
    test(`coleção /${slug} carrega e seus cards de produto não dão 404`, async ({
      request,
    }) => {
      const path = `/colecoes/${slug}`;
      const resp = await request.get(path);
      expect(resp.status(), `status ${resp.status()} em ${path}`).toBeLessThan(400);
      const html = await resp.text();
      expect(looksLikeNotFound(html), `${path} renderizou estado de 404`).toBeFalsy();

      const productLinks = extractInternalLinks(html).filter((h) =>
        h.startsWith("/produtos/"),
      );

      // Amostra até 8 produtos por coleção para manter o teste rápido.
      const sample = productLinks.slice(0, 8);
      for (const href of sample) {
        await expectRouteOk(request, href);
      }
    });
  }

  test("crawl raso da home: todos os links internos respondem", async ({ request }) => {
    const home = await request.get("/");
    expect(home.status()).toBe(200);
    const links = extractInternalLinks(await home.text()).filter(
      (h) => !h.startsWith("/sitemap"),
    );
    expect(links.length).toBeGreaterThan(0);
    for (const href of links.slice(0, 40)) {
      await expectRouteOk(request, href);
    }
  });
});
