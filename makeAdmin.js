const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    await prisma.user.update({
      where: { id: users[0].id },
      data: { role: 'ADMIN' }
    });
    console.log(`Successfully made ${users[0].email} an ADMIN!`);
  } else {
    console.log("No users found in database. Please register an account first.");
  }
}

makeAdmin().catch(console.error).finally(() => prisma.$disconnect());
