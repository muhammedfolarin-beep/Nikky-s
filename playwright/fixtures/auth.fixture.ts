import { test as base, Page } from "@playwright/test";
import { encode } from "next-auth/jwt";
import { TEST_CUSTOMER, TEST_ADMIN } from "../utils/test-db";

type AuthFixtures = {
  customerPage: Page;
  adminPage: Page;
};

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "f63c0a4e7e8b91c2d5a3f4e1b8c7d6a5e2f1b0c9d8a7b6c5d4e3f2a1b0c9d8e7";

export async function setupCommonMocks(page: Page) {
  // Mock external currency rate exchange API
  await page.route("**/open.er-api.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
      contentType: "application/json",
      body: JSON.stringify({
        result: "success",
        base_code: "USD",
        rates: { USD: 1, NGN: 1550, EUR: 0.92, GBP: 0.79 },
      }),
    });
  });
}

export const test = base.extend<AuthFixtures>({
  customerPage: async ({ browser }, use) => {
    const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
    const context = await browser.newContext({
      baseURL,
      extraHTTPHeaders: { "x-playwright-test": "true" },
    });

    const sessionToken = await encode({
      token: {
        name: TEST_CUSTOMER.name,
        email: TEST_CUSTOMER.email,
        role: "USER",
        sub: "test_customer_id_123",
      },
      secret: AUTH_SECRET,
    });

    await context.addCookies([
      {
        name: "next-auth.session-token",
        value: sessionToken,
        url: baseURL,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);

    const page = await context.newPage();
    await setupCommonMocks(page);
    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
    const context = await browser.newContext({
      baseURL,
      extraHTTPHeaders: { "x-playwright-test": "true" },
    });

    const sessionToken = await encode({
      token: {
        name: TEST_ADMIN.name,
        email: TEST_ADMIN.email,
        role: "ADMIN",
        sub: "test_admin_id_123",
      },
      secret: AUTH_SECRET,
    });

    await context.addCookies([
      {
        name: "next-auth.session-token",
        value: sessionToken,
        url: baseURL,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);

    const page = await context.newPage();
    await setupCommonMocks(page);
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
