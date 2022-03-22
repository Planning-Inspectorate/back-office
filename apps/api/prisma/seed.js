import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

/**
 * @returns {Date} date two weeks ago
 */
function getDateTwoWeeksAgo() {
	const date = new Date();
	date.setDate(date.getDate() - 14);
	date.setHours(23);
	return date;
}

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
		status: 'invalid_appeal',
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
		appellantName: 'Bob Ross',
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'awaiting_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
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

/**
 *
 */
async function main() {
	try {
		const createdAppeals = [];
		for (const appealData of appealsData) {
			const appeal = prisma.appeal.create({ data: appealData });
			createdAppeals.push(appeal);
		}
		await Promise.all(createdAppeals);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

main();
