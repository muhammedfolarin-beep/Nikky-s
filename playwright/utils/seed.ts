import { seedTestDatabase } from "./test-db";

async function main() {
  console.log("Seeding E2E test database...");
  await seedTestDatabase();
  console.log("E2E test database successfully seeded.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during E2E database seeding:", err);
  process.exit(1);
});
