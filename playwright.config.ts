import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config for the storefront.
 *
 * Default target: published production URL.
 * Override via `BASE_URL=... bunx playwright test`.
 */
const baseURL = process.env.BASE_URL ?? "https://pplcompanystore.lovable.app";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
