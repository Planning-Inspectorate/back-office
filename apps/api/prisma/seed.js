import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

const appealsData = [
	{
		reference: 'APP/Q9999/D/21/1345264',
		appellantName: 'Lee Thornton',
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		address: {
			create: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				city: 'Kent',
				postcode: 'MD21 5XY'
			}
		}
	},
	{
		reference: 'APP/Q9999/D/21/1345264',
		appellantName: 'Lee Thornton',
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'invalid',
		address: {
			create: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				city: 'Kent',
				postcode: 'MD21 5XY'
			}
		}
	}
];

async function main() {
	console.log(`Start seeding ...`);
	for (const a of appealsData) {
		const appeal = await prisma.appeal.create({
			data: a
		});
		console.log(`Created appeal with id: ${appeal.id}`);
	}
	console.log(`Seeding finished.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
