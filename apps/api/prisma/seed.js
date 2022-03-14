import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

const appealsData = [
    {
        reference: 'SOME REFERENCE',
        address: {
            create:
            {
                addressLine1: 'first line',
                city: 'city',
                postcode: 'A11 0ZZ'
            },
        },
    }
]

async function main() {
    console.log(`Start seeding ...`)
    for (const a of appealsData) {
        const appeal = await prisma.appeal.create({
            data: a
        })
        console.log(`Created appeal with id: ${appeal.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })