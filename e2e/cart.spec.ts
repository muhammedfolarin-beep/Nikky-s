import { test, expect } from "@playwright/test";
import { setupCommonMocks } from "../playwright/fixtures/auth.fixture";
import { getTestProductId } from "../playwright/utils/test-db";

async function addFirstProductToBag(page: any) {
  const productId = await getTestProductId();
  await page.goto(`/shop/${productId}`, { waitUntil: "domcontentloaded" });

  const sizeBtn = page.getByRole("button", { name: "40R", exact: true });
  await expect(sizeBtn).toBeVisible({ timeout: 20000 });
  await expect(async () => {
    await sizeBtn.click();
    await expect(sizeBtn).toHaveClass(/bg-brand-midnight/, { timeout: 1000 });
  }).toPass({ timeout: 15000 });

  const addToBagBtn = page.getByTestId("add-to-bag-button");
  await expect(addToBagBtn).toBeVisible({ timeout: 20000 });
  const drawer = page.getByTestId("cart-drawer");
  await expect(async () => {
    await addToBagBtn.click();
    await expect(drawer).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15000 });
}

test.describe("Journey 3: Shopping Bag (Cart) & Client State Management", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", msg => console.log("[BROWSER]", msg.text()));
    page.on("dialog", d => {
      console.log("[BROWSER DIALOG]", d.message());
      d.accept();
    });
    await setupCommonMocks(page);
  });

  test("Happy Path: Add product to bag, adjust quantity, and verify subtotal", async ({ page }) => {
    await addFirstProductToBag(page);

    // Verify cart drawer is opened
    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible({ timeout: 15000 });

    // Verify subtotal is displayed
    const subtotal = page.getByTestId("cart-subtotal");
    await expect(subtotal).toBeVisible({ timeout: 15000 });

    // Increment item quantity in drawer
    const increaseBtn = drawer.getByRole("button", { name: "Increase quantity" });
    await expect(increaseBtn).toBeVisible({ timeout: 15000 });
    await increaseBtn.click();
    await expect(drawer.locator("span.w-4.text-center")).toHaveText("2");

    // Proceed to Checkout button from drawer
    const checkoutBtn = page.getByTestId("cart-checkout-btn");
    await expect(checkoutBtn).toBeVisible();
  });

  test("Happy Path: Cart state persists across page navigation", async ({ page }) => {
    await addFirstProductToBag(page);

    // Verify drawer opened
    await expect(page.getByTestId("cart-drawer")).toBeVisible({ timeout: 15000 });

    // Navigate to homepage
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    // Cart badge should reflect item
    const cartTrigger = page.getByTestId("cart-trigger");
    await expect(cartTrigger).toBeVisible({ timeout: 15000 });
    await expect(cartTrigger.getByText("1")).toBeVisible({ timeout: 15000 });
  });

  test("Happy Path: Removing item from cart shows empty bag state", async ({ page }) => {
    await addFirstProductToBag(page);

    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible({ timeout: 15000 });

    // Click remove button
    const removeBtn = drawer.getByTestId("remove-cart-item-btn");
    await expect(removeBtn).toBeVisible({ timeout: 15000 });
    await removeBtn.click();

    // Verify empty state message
    await expect(drawer.getByTestId("empty-cart-text")).toBeVisible({ timeout: 15000 });
  });

  test("Failure State: Navigating to /checkout with an empty cart shows empty bag notice", async ({ page }) => {
    // Clear localStorage before test
    await page.goto("/home", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());

    await page.goto("/checkout", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Your shopping bag is empty" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Explore Catalog" })).toBeVisible();
  });
});
