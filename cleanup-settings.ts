import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.storeSetting.findMany({
    orderBy: { updatedAt: "desc" }
  });
  
  if (settings.length > 1) {
    const toKeep = settings[0];
    console.log(`Keeping settings id: ${toKeep.id}`);
    
    const toDelete = settings.slice(1).map(s => s.id);
    await prisma.storeSetting.deleteMany({
      where: { id: { in: toDelete } }
    });
    console.log(`Deleted ${toDelete.length} old setting rows.`);
  } else {
    console.log("No duplicate settings found.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
