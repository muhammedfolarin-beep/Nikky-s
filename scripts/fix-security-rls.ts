import { PrismaClient } from "@prisma/client";

const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

async function fixSecurityVulnerabilities() {
  console.log("Applying Row Level Security (RLS) via direct session connection...\n");

  const tables = [
    "StoreSetting",
    "Product",
    "Account",
    "Session",
    "User",
    "VerificationToken",
    "Order",
    "OrderItem"
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`[OK] Enabled RLS on public."${table}"`);
    } catch (err: any) {
      console.error(`[Error] Failed on "${table}":`, err.message);
    }
  }

  console.log("\nFinished enabling RLS on all tables.");
}

fixSecurityVulnerabilities()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
