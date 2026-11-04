import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the Next.js static export (`out/`), served by
 * `serve`. Run `npm run build` first so `out/` exists, then `npm run e2e`.
 *
 * In CI the workflow builds once, installs the Chromium browser, then runs
 * these specs. `reuseExistingServer` lets a locally-running server be reused
 * for fast iteration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx serve out/ -l 4173 --no-clipboard",
    url: "http://localhost:4173",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
