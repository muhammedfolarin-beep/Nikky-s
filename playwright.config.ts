import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for SN24 E2E Test Suite.
 * Configured for both local interactive development and GitHub Actions CI.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 90000,
  expect: {
    timeout: 15000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    extraHTTPHeaders: {
      "x-playwright-test": "true"
    },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 20000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: "chromium",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
