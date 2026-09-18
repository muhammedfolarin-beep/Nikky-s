import { test, expect } from "@playwright/test";
import { TEST_CUSTOMER, TEST_ADMIN } from "../playwright/utils/test-db";
import { setupCommonMocks } from "../playwright/fixtures/auth.fixture";

test.describe("Journey 1: Customer & Admin Authentication Lifecycle", () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);
  });

  test("Happy Path: Existing customer logs in successfully and signs out", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();

    await page.getByTestId("login-email-input").fill(TEST_CUSTOMER.email);
    await page.getByTestId("login-password-input").fill(TEST_CUSTOMER.password);
    await page.getByTestId("login-submit-btn").click();

    await expect(page).toHaveURL(/\/home/);
    // Verified user header is displayed
    await expect(page.getByTestId("user-account-link")).toBeVisible();

    // Sign out flow
    await page.getByTestId("signout-button").click();
    await expect(page.getByTestId("signin-link")).toBeVisible();
  });

  test("Happy Path: Admin user logs in to Admin Portal", async ({ page }) => {
    await page.goto("/admin-login");
    await expect(page.getByRole("heading", { name: "Admin Portal" })).toBeVisible();

    await page.getByTestId("admin-login-email").fill(TEST_ADMIN.email);
    await page.getByTestId("admin-login-password").fill(TEST_ADMIN.password);
    await page.getByTestId("admin-login-submit").click();

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: "Dashboard Overview" })).toBeVisible();
  });

  test("Happy Path: New customer registers with valid email and signs in", async ({ page }) => {
    const randomEmail = `customer.${Date.now()}@gmail.com`;

    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();

    await page.getByTestId("signup-first-name").fill("Alexander");
    await page.getByTestId("signup-last-name").fill("Vanderbilt");
    await page.getByTestId("signup-email").fill(randomEmail);
    await page.getByTestId("signup-password").fill("SecurePassword123!");
    await page.getByTestId("signup-submit-btn").click();

    await expect(page).toHaveURL(/\/home/, { timeout: 35000 });
    await expect(page.getByTestId("user-account-link")).toBeVisible();
  });

  test("Failure State: Registration with disposable/temp email is blocked", async ({ page }) => {
    await page.goto("/signup");

    await page.getByTestId("signup-first-name").fill("Fake");
    await page.getByTestId("signup-last-name").fill("User");
    await page.getByTestId("signup-email").fill("attacker@10minutemail.com");
    await page.getByTestId("signup-password").fill("SecurePassword123!");
    await page.getByTestId("signup-submit-btn").click();

    // Verify error banner is visible
    const errorBox = page.getByTestId("signup-error-banner");
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/disposable/i);
  });

  test("Failure State: Registration with typo domain offers suggestion", async ({ page }) => {
    await page.goto("/signup");

    await page.getByTestId("signup-first-name").fill("John");
    await page.getByTestId("signup-last-name").fill("Doe");
    await page.getByTestId("signup-email").fill("john.doe@gmial.com");
    await page.getByTestId("signup-password").fill("SecurePassword123!");
    await page.getByTestId("signup-submit-btn").click();

    const errorBox = page.getByTestId("signup-error-banner");
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/Did you mean @gmail.com/i);
  });

  test("Failure State: Login with invalid password displays error", async ({ page }) => {
    await page.goto("/login");

    await page.getByTestId("login-email-input").fill(TEST_CUSTOMER.email);
    await page.getByTestId("login-password-input").fill("WrongPassword123!");
    await page.getByTestId("login-submit-btn").click();

    const errorBox = page.getByTestId("login-error-banner");
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toContainText(/Invalid email or password/i);
  });

  test("Access Control: Unauthenticated access to /account redirects to /login", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
  });

  test("Access Control: Unauthenticated access to /admin redirects to /admin-login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin-login/);
  });
});
