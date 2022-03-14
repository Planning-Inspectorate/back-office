
import Prisma from '@prisma/client'
const { PrismaClient } = Prisma

const prisma = new PrismaClient()

async function main() {
	const appeals = await prisma.appeal.findMany()
	console.log(appeals)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })