import { test, expect } from "@playwright/test";
import { setupPaystackMock } from "../playwright/fixtures/mock-payment.fixture";
import { setupCommonMocks } from "../playwright/fixtures/auth.fixture";
import { getTestProductId } from "../playwright/utils/test-db";

async function addFirstProductAndGoToCheckout(page: any) {
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
  const checkoutBtn = page.getByTestId("cart-checkout-btn");
  await expect(async () => {
    await addToBagBtn.click();
    await expect(checkoutBtn).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 15000 });

  await checkoutBtn.click();
  await expect(page).toHaveURL(/\/checkout/, { timeout: 20000 });
}

test.describe("Journey 4: Multi-Step Checkout & Order Placement", () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);
  });

  test("Happy Path: Complete checkout order placement with mock payment", async ({ page }) => {
    // Setup deterministic Paystack route intercept
    await setupPaystackMock(page, { shouldSucceed: true });

    // Add item to cart and navigate to checkout
    await addFirstProductAndGoToCheckout(page);

    // 3. Step 1: Shipping Address
    await page.getByTestId("shipping-firstName").fill("Olumide");
    await page.getByTestId("shipping-lastName").fill("Adebayo");
    await page.getByTestId("shipping-email").fill("olumide.adebayo@gmail.com");
    await page.getByTestId("shipping-phone").fill("+2348012345678");
    await page.getByTestId("shipping-address").fill("14 Admiralty Way");

    await page.getByTestId("continue-to-courier-btn").click();

    // 4. Step 2: Courier & Delivery Method
    await expect(page.getByText(/Courier & Delivery Method/i)).toBeVisible();
    await page.getByTestId("proceed-to-payment-btn").click();

    // 5. Step 3: Payment Method
    await expect(page.getByText(/Payment & Confirmation/i)).toBeVisible();

    // Paystack Button is rendered
    const paystackBtn = page.getByTestId("paystack-pay-btn");
    await expect(paystackBtn).toBeVisible();

    // Click Paystack button to trigger mocked transaction
    await paystackBtn.click();

    // Verify transition to success page
    await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 35000 });
  });

  test("Failure State: Incomplete shipping fields blocks proceeding to Step 2", async ({ page }) => {
    // Add item to cart and navigate to checkout
    await addFirstProductAndGoToCheckout(page);

    // Leave required fields blank and click continue
    await page.getByTestId("continue-to-courier-btn").click();

    // Validation error banner is shown
    const errorBanner = page.getByTestId("checkout-error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/required shipping fields/i);
  });

  test("Failure State: Malformed email in shipping info blocks progression", async ({ page }) => {
    await addFirstProductAndGoToCheckout(page);

    await page.getByTestId("shipping-firstName").fill("Jane");
    await page.getByTestId("shipping-lastName").fill("Doe");
    await page.getByTestId("shipping-email").fill("invalid-email-format");
    await page.getByTestId("shipping-phone").fill("+2348011112222");
    await page.getByTestId("shipping-address").fill("Plot 10, Victoria Island");

    await page.getByTestId("continue-to-courier-btn").click();

    const errorBanner = page.getByTestId("checkout-error-banner");
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/valid email address/i);
  });

  test("Failure State: Customer closes Paystack modal without completing payment", async ({ page }) => {
    await setupPaystackMock(page, { shouldSucceed: false });

    await addFirstProductAndGoToCheckout(page);

    await page.getByTestId("shipping-firstName").fill("Chidi");
    await page.getByTestId("shipping-lastName").fill("Eze");
    await page.getByTestId("shipping-email").fill("chidi.eze@gmail.com");
    await page.getByTestId("shipping-phone").fill("+2348033334444");
    await page.getByTestId("shipping-address").fill("5 Adeola Odeku");

    await page.getByTestId("continue-to-courier-btn").click();
    await page.getByTestId("proceed-to-payment-btn").click();

    const paystackBtn = page.getByTestId("paystack-pay-btn");
    await expect(paystackBtn).toBeVisible();
    await paystackBtn.click();

    // Should remain on checkout page in Step 3 without navigating to success
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText(/Payment & Confirmation/i)).toBeVisible();
  });
});
