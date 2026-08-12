import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nikkys.com' },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email: 'admin@nikkys.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    },
  })
  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
