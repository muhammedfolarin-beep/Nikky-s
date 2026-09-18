import { test, expect } from "../playwright/fixtures/auth.fixture";

test.describe("Journey 5: Admin Management & Store Operations", () => {
  test("Happy Path: Admin Dashboard metrics overview", async ({ adminPage }) => {
    await adminPage.goto("/admin", { waitUntil: "domcontentloaded" });
    await expect(adminPage.getByRole("heading", { name: "Dashboard Overview" })).toBeVisible({ timeout: 20000 });

    // Verify key metric cards
    await expect(adminPage.getByText("Total Revenue")).toBeVisible();
    await expect(adminPage.getByText("Total Orders")).toBeVisible();
    await expect(adminPage.getByText("Total Products")).toBeVisible();
    await expect(adminPage.getByText("Total Customers")).toBeVisible();
  });

  test("Happy Path: Product Management - View catalog and navigate to new product form", async ({ adminPage }) => {
    await adminPage.goto("/admin/products", { waitUntil: "domcontentloaded" });
    await expect(adminPage.getByRole("heading", { name: "Products" })).toBeVisible({ timeout: 20000 });

    // Click Add Product
    const addProductBtn = adminPage.getByTestId("admin-add-product-btn");
    await expect(addProductBtn).toBeVisible();
    await addProductBtn.click({ noWaitAfter: true });

    await expect(adminPage).toHaveURL(/\/admin\/products\/new/);
    await expect(adminPage.getByText(/Add New Product/i)).toBeVisible({ timeout: 20000 });

    // Fill in product attributes
    await adminPage.getByPlaceholder(/Tailored Wool Blazer/i).fill("E2E Dynamic Silk Trench Coat");
    await adminPage.getByPlaceholder(/Enter detailed product description/i).fill("High-end tailored coat.");
  });

  test("Happy Path: Customer directory management", async ({ adminPage }) => {
    await adminPage.goto("/admin/customers", { waitUntil: "domcontentloaded" });
    await expect(adminPage.getByRole("heading", { name: "Customers" })).toBeVisible({ timeout: 20000 });

    // Verify customer table headers
    await expect(adminPage.getByText("Customer", { exact: true })).toBeVisible();
    await expect(adminPage.getByText("Role", { exact: true })).toBeVisible();
  });

  test("Happy Path: Store settings configuration", async ({ adminPage }) => {
    await adminPage.goto("/admin/settings", { waitUntil: "domcontentloaded" });
    await expect(adminPage.getByRole("heading", { name: /Settings/i })).toBeVisible({ timeout: 20000 });

    // Check contact email or store name fields
    const storeNameInput = adminPage.locator('input[name="storeName"], input#storeName');
    if (await storeNameInput.isVisible()) {
      await expect(storeNameInput).toHaveValue(/SN24/i);
    }
  });

  test("Failure State: Submitting empty product creation form shows validation error", async ({ adminPage }) => {
    await adminPage.goto("/admin/products/new");
    await expect(adminPage.getByText(/Add New Product/i)).toBeVisible({ timeout: 20000 });

    // Click submit without entering required name, price, images
    await adminPage.getByRole("button", { name: /Add Product/i }).click();

    // Verify error message is displayed
    await expect(adminPage.getByText(/Name, Price, and Images are required/i)).toBeVisible();
  });

  test("Access Control: Standard customer cannot access admin routes", async ({ customerPage }) => {
    await customerPage.goto("/admin", { waitUntil: "domcontentloaded" });
    // Standard customer should be redirected away from admin dashboard
    await expect(customerPage).toHaveURL(/\/home/);
  });
});
