import { test as setup, expect } from "@playwright/test";
import { TEST_CUSTOMER, TEST_ADMIN, seedTestDatabase } from "../playwright/utils/test-db";
import fs from "fs";
import path from "path";

const authDir = path.join(process.cwd(), "playwright/.auth");

setup("Global Setup: Seed Database and Pre-authenticate Sessions", async ({ browser }) => {
  setup.setTimeout(120000);

  // Ensure auth directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 1. Seed base fixtures once
  await seedTestDatabase();

  // 2. Pre-authenticate Customer in isolated context
  const customerContext = await browser.newContext({
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    extraHTTPHeaders: { "x-playwright-test": "true" },
  });
  const customerPage = await customerContext.newPage();
  await customerPage.goto("/login");
  const customerEmail = customerPage.locator('input[type="email"]');
  await customerEmail.click();
  await customerEmail.fill(TEST_CUSTOMER.email);
  const customerPassword = customerPage.locator('input[type="password"]');
  await customerPassword.click();
  await customerPassword.fill(TEST_CUSTOMER.password);
  await customerPage.locator('button[type="submit"]').click();
  await expect(customerPage).toHaveURL(/\/home/, { timeout: 30000 });
  await customerContext.storageState({ path: path.join(authDir, "customer.json") });
  await customerContext.close();

  // 3. Pre-authenticate Admin in isolated context
  const adminContext = await browser.newContext({
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    extraHTTPHeaders: { "x-playwright-test": "true" },
  });
  const adminPage = await adminContext.newPage();
  await adminPage.goto("/admin-login");
  const adminEmail = adminPage.locator('input[type="email"]');
  await adminEmail.click();
  await adminEmail.fill(TEST_ADMIN.email);
  const adminPassword = adminPage.locator('input[type="password"]');
  await adminPassword.click();
  await adminPassword.fill(TEST_ADMIN.password);
  await adminPage.locator('button[type="submit"]').click();
  await expect(adminPage).toHaveURL(/\/admin/, { timeout: 30000 });
  await adminContext.storageState({ path: path.join(authDir, "admin.json") });
  await adminContext.close();
});
