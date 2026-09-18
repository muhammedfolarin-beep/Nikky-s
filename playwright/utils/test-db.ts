import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const TEST_CUSTOMER = {
  email: "e2e_customer@sn24.test",
  password: "Password123!",
  name: "E2E Test Customer",
  role: "USER"
};

export const TEST_ADMIN = {
  email: "e2e_admin@sn24.test",
  password: "AdminPassword123!",
  name: "E2E Test Administrator",
  role: "ADMIN"
};

export const TEST_PRODUCT = {
  name: "E2E Signature Velvet Blazer",
  brand: "SN24 Atelier Test",
  price: 450,
  originalPrice: 550,
  category: "Suits & Tailoring",
  type: "Outerwear",
  colors: ["#111111", "#C6A87D"],
  sizes: ["40R", "42R", "44R"],
  images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"],
  isNew: true,
  isBestseller: true,
  description: "Hand-finished silk velvet tailoring crafted for E2E automated test scenarios.",
  material: "100% Italian Silk Velvet",
  careInstructions: "Dry Clean Only",
  collection: "Monochrome Minimalist"
};

/**
 * Seeds base test users and products required for E2E test isolation.
 */
export async function seedTestDatabase() {
  try {
    const customerPasswordHash = await bcrypt.hash(TEST_CUSTOMER.password, 10);
    const adminPasswordHash = await bcrypt.hash(TEST_ADMIN.password, 10);

    // Upsert customer
    await prisma.user.upsert({
      where: { email: TEST_CUSTOMER.email },
      update: {
        name: TEST_CUSTOMER.name,
        role: TEST_CUSTOMER.role,
        password: customerPasswordHash
      },
      create: {
        email: TEST_CUSTOMER.email,
        name: TEST_CUSTOMER.name,
        role: TEST_CUSTOMER.role,
        password: customerPasswordHash
      }
    });

    // Upsert admin
    await prisma.user.upsert({
      where: { email: TEST_ADMIN.email },
      update: {
        name: TEST_ADMIN.name,
        role: TEST_ADMIN.role,
        password: adminPasswordHash
      },
      create: {
        email: TEST_ADMIN.email,
        name: TEST_ADMIN.name,
        role: TEST_ADMIN.role,
        password: adminPasswordHash
      }
    });

    // Upsert test product
    const existingProduct = await prisma.product.findFirst({
      where: { name: TEST_PRODUCT.name }
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: TEST_PRODUCT
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[E2E DB Seeder Error]:", error);
    throw error;
  }
}

/**
 * Returns the ID of the seeded test product for direct PDP navigation.
 */
export async function getTestProductId(): Promise<string> {
  const p = await prisma.product.findFirst({
    where: { name: TEST_PRODUCT.name }
  });
  return p?.id || "cmtjrpi610002gpp9d801nr3o";
}

/**
 * Cleans up temporary test data generated during test execution.
 */
export async function cleanupTestDatabase() {
  try {
    // Delete orders created by test customer
    const testCustomer = await prisma.user.findUnique({
      where: { email: TEST_CUSTOMER.email }
    });

    if (testCustomer) {
      await prisma.orderItem.deleteMany({
        where: { order: { userId: testCustomer.id } }
      });
      await prisma.order.deleteMany({
        where: { userId: testCustomer.id }
      });
    }

    // Delete dynamic products created during admin tests
    await prisma.product.deleteMany({
      where: { name: { startsWith: "E2E Dynamic" } }
    });

    return { success: true };
  } catch (error) {
    console.error("[E2E DB Cleanup Error]:", error);
  }
}

export { prisma };
