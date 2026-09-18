import { cleanupTestDatabase } from "./test-db";

async function main() {
  console.log("Cleaning up E2E test database...");
  await cleanupTestDatabase();
  console.log("E2E test database cleanup completed.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during E2E database cleanup:", err);
  process.exit(1);
});
