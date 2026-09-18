import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sn24.com.ng' },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email: 'admin@sn24.com.ng',
      name: 'SN24 Admin',
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
