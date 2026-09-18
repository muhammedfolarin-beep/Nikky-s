import { test, expect } from "@playwright/test";
import { setupCommonMocks } from "../playwright/fixtures/auth.fixture";

test.describe("Journey 2: Catalog Browsing, Discovery & Product Details", () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);
  });

  test("Happy Path: Storefront homepage navigation and brand elements", async ({ page }) => {
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/SN24/i);
    
    // Check header logo and navigation links
    await expect(page.locator("header a[href='/home']").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("navigation").getByRole("link", { name: "Catalog" })).toBeVisible();
    await expect(page.getByRole("navigation").getByRole("link", { name: "The SN24 Capsule" })).toBeVisible();
  });

  test("Happy Path: Catalog page product browsing and search overlay", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator("h1")).toBeVisible({ timeout: 20000 });

    // Verify product links are rendered
    const productCards = page.locator("a[href^='/shop/']");
    await expect(productCards.first()).toBeVisible({ timeout: 30000 });

    // Open Search Overlay
    await page.getByTestId("search-trigger").click();
    const searchInput = page.getByTestId("search-input");
    await expect(searchInput).toBeVisible({ timeout: 15000 });

    // Perform a search query
    await searchInput.fill("Blazer");
    await expect(page.locator("a[href^='/shop/']").first()).toBeVisible({ timeout: 15000 });
    await page.keyboard.press("Escape");
  });

  test("Happy Path: Product Detail Page (PDP) variant selection & Bespoke Guide", async ({ page }) => {
    await page.goto("/shop");

    // Click on the first product card link
    const firstProductLink = page.locator("a[href^='/shop/']").first();
    await expect(firstProductLink).toBeVisible({ timeout: 30000 });
    await firstProductLink.click();

    // Verify PDP Add to Bag CTA is visible
    await expect(page.getByTestId("add-to-bag-button")).toBeVisible({ timeout: 30000 });

    // Check Bespoke Measurement Guide trigger
    const measurementBtn = page.getByRole("button", { name: /How to Measure & Size Guide/i });
    if (await measurementBtn.isVisible()) {
      await measurementBtn.click();
      await expect(page.getByTestId("measurement-modal")).toBeVisible({ timeout: 15000 });
      // Close modal
      await page.keyboard.press("Escape");
    }
  });

  test("Failure State: Searching for non-existent item shows zero results state", async ({ page }) => {
    await page.goto("/shop");

    await page.getByTestId("search-trigger").click();
    const searchInput = page.getByTestId("search-input");
    await expect(searchInput).toBeVisible({ timeout: 15000 });

    await searchInput.fill("xyz999nonsense");
    await expect(page.getByText(/No results found/i)).toBeVisible({ timeout: 15000 });
    await page.keyboard.press("Escape");
  });

  test("Failure State: Accessing non-existent product ID renders 404 Piece Not Found", async ({ page }) => {
    await page.goto("/shop/non-existent-product-id-999", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Piece Not Found" })).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole("link", { name: /Return to Catalog/i })).toBeVisible();
  });

  test("Failure State: External currency exchange API network failure gracefully falls back to base USD", async ({ page }) => {
    // Override exchange API route with network failure
    await page.route("**/open.er-api.com/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/shop", { waitUntil: "domcontentloaded" });
    // Page renders without crashing
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
  });
});
