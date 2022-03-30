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
		reference: 'APP/Q9999/D/21/5463281',
		appellantName: 'Haley Eland',
		localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
		planningApplicationReference: '32569/APP/2021/2102',
		address: {
			create: {
				addressLine1: '55 Butcher Street',
				city: 'Thurnscoe',
				postcode: 'S63 0RB'
			}
		}
	},
	{
		reference: 'APP/Q9999/D/21/1203521',
		appellantName: 'Roger Simmons',
		localPlanningDepartment: 'Worthing Borough Council',
		planningApplicationReference: '25468/APP/2021/1185',
		address: {
			create: {
				addressLine1: '8 The Chase',
				city: 'Findon',
				postcode: 'BN14 0TT'
			}
		}
	},
	{
		reference: 'APP/Q9999/D/21/1154923',
		appellantName: 'Sophie Skinner',
		localPlanningDepartment: 'Dorset Council',
		planningApplicationReference: '19457/APP/2021/5421',
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
		reference: 'APP/Q9999/D/21/1087562',
		appellantName: 'Ryan Marshall',
		localPlanningDepartment: 'Basingstoke and Deane Borough Council',
		planningApplicationReference: '10016/APP/2021/960',
		address: {
			create: {
				addressLine1: '44 Rivervale',
				city: 'Bridport',
				postcode: 'DT6 5RN'
			}
		}
	},
	{
		reference: 'APP/Q9999/D/21/1365524',
		appellantName: 'Fiona Burgess',
		localPlanningDepartment: 'Wiltshire Council',
		planningApplicationReference: '9423/APP/2021/1223',
		address: {
			create: {
				addressLine1: '92 Huntsmoor Road',
				city: 'Tadley',
				postcode: 'RG26 4BX'
			}
		}
	},
	{
		reference: 'APP/Q9999/D/21/1224115',
		appellantName: 'Kevin Fowler',
		localPlanningDepartment: 'Waveney District Council',
		planningApplicationReference: '18543/APP/2021/6627',
		status: 'awaiting_validation_info',
		address: {
			create: {
				addressLine1: '1 Grove Cottage',
				addressLine2: 'Shotesham Road',
				city: 'Woodton',
				postcode: 'NR35 2ND'
			}
		},
		ValidationDecision: {
			create: {
				decision: 'incomplete',
				namesDoNotMatch: true,
				sensitiveInfo: true,
				missingApplicationForm: true,
				missingDecisionNotice: true,
				missingGroundsForAppeal: true,
				missingSupportingDocuments: true,
				inflamatoryComments: true,
				openedInError: true,
				wrongAppealTypeUsed: true,
				otherReasons: 'Some other weird reason'
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
		startedAt: new Date(),
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
		reference: 'APP/Q9999/D/21/1087562',
		appellantName: 'Bob Ross',
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'received_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(),
		address: {
			create: {
				addressLine1: '92 Huntsmoor Road',
				city: 'Tadley',
				postcode: 'RG26 4BX'
			}
		}
	},
	{
		reference: 'APP/Q9999/D/21/5463281',
		appellantName: 'Bob Ross',
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'awaiting_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(),
		address: {
			create: {
				addressLine1: '55 Butcher Street',
				city: 'Thurnscoe',
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
