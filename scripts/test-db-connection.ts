import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.count();
    const products = await prisma.product.count();
    const orders = await prisma.order.count();
    const settings = await prisma.storeSetting.findFirst();

    console.log("Database Stats:");
    console.log(`- Users: ${users}`);
    console.log(`- Products: ${products}`);
    console.log(`- Orders: ${orders}`);
    console.log(`- Store Settings:`, settings);

    const sampleProducts = await prisma.product.findMany({ take: 3 });
    console.log("Sample Products:", JSON.stringify(sampleProducts, null, 2));
  } catch (error) {
    console.error("Error inspecting DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
