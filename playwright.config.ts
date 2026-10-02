import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  outputDir: "test-results",
  use: {
    baseURL,
    browserName: "chromium",
    locale: "en-GB",
    timezoneId: "Europe/London",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    serviceWorkers: "block",
  },
  projects: [
    { name: "chromium-mobile", use: { viewport: { width: 360, height: 800 } } },
    {
      name: "chromium-tablet",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "chromium-desktop",
      use: { viewport: { width: 1440, height: 1000 } },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer:
      !process.env.CI && process.env.PLAYWRIGHT_REUSE_SERVER === "1",
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
