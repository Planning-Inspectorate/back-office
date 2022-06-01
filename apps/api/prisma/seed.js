import Prisma from '@prisma/client';
import pino from 'pino';
import {
	addressesList,
	appealDetailsFromAppellantList,
	appellantsList,
	completeValidationDecisionSample,
	incompleteReviewQuestionnaireSample,
	incompleteValidationDecisionSample,
	invalidValidationDecisionSample,
	localPlanningDepartmentList,
	lpaQuestionnaireList
} from './seed-samples.js';

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

/**
 * @returns {string}
 */
function generateAppealReference() {
	const number = Math.floor(Math.random() * 999_999 + 1);

	return `APP/Q9999/D/21/${number}`;
}

/**
 *
 * @param {object[]} list
 * @returns {object}
 */
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

const appealTypes = {
	HAS: 'household',
	FPA: 'full planning'
};

const buildCompoundState = (
	lpaQuestionnaireAndInspectorPickupState,
	statementsAndFinalCommentsState,
	createdAt = new Date()
) => {
	return [
		{
			status: lpaQuestionnaireAndInspectorPickupState,
			createdAt,
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		},
		{
			status: statementsAndFinalCommentsState,
			createdAt,
			subStateMachineName: 'statementsAndFinalComments',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		}
	];
};

const appealFactory = ({
	typeShorthand,
	statuses = {},
	incompleteValidationDecision = false,
	invalidValidationDecision = false,
	completeValidationDecision = false,
	lpaQuestionnaire = false,
	startedAt = null,
	incompleteReviewQuestionnaire = false,
	completeReviewQuestionnaire = false,
	connectToUser = false,
	siteVisitBooked = false
}) => {
	return {
		appealType: { connect: { shorthand: typeShorthand } },
		reference: generateAppealReference(),
		startedAt,
		appealStatus: { create: statuses },
		appellant: { create: pickRandom(appellantsList) },
		localPlanningDepartment: pickRandom(localPlanningDepartmentList),
		planningApplicationReference: '48269/APP/2021/1482',
		address: { create: pickRandom(addressesList) },
		...(incompleteValidationDecision && {
			validationDecision: { create: incompleteValidationDecisionSample }
		}),
		...(invalidValidationDecision && {
			validationDecision: { create: invalidValidationDecisionSample }
		}),
		...(completeValidationDecision && {
			validationDecision: { create: completeValidationDecisionSample }
		}),
		...(lpaQuestionnaire && { lpaQuestionnaire: { create: pickRandom(lpaQuestionnaireList) } }),
		...(incompleteReviewQuestionnaire && {
			reviewQuestionnaire: { create: incompleteReviewQuestionnaireSample }
		}),
		...(completeReviewQuestionnaire && { reviewQuestionnaire: { create: { complete: true } } }),
		appealDetailsFromAppellant: { create: pickRandom(appealDetailsFromAppellantList) },
		...(connectToUser && {
			user: {
				connectOrCreate: {
					create: {
						azureReference: 1
					},
					where: {
						azureReference: 1
					}
				}
			}
		}),
		...(siteVisitBooked && {
			siteVisit: {
				create: {
					visitDate: new Date(2022, 3, 1),
					visitSlot: '1pm - 2pm',
					visitType: 'unaccompanied'
				}
			}
		})
	};
};

const newAppeals = [
	appealFactory('HAS'),
	appealFactory('HAS'),
	appealFactory('HAS'),
	appealFactory('HAS'),
	appealFactory('HAS'),
	appealFactory('HAS'),
	appealFactory('FPA'),
	appealFactory('FPA'),
	appealFactory('FPA'),
	appealFactory('FPA'),
	appealFactory('FPA'),
	appealFactory('FPA')
];

const appealsAwaitingValidationInfo = [
	appealFactory('HAS', { status: 'awaiting_validation_info' }, true),
	appealFactory('FPA', { status: 'awaiting_validation_info' }, true)
];

const invalidAppeals = [
	appealFactory('HAS', { status: 'invalid_appeal' }, false, true),
	appealFactory('FPA', { status: 'invalid_appeal' }, false, true)
];

const appealsAwaitingLPAQuestionnaire = [
	appealFactory(
		'HAS',
		{ status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date()
	),
	appealFactory(
		'HAS',
		{ status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date()
	),
	appealFactory(
		'HAS',
		{ status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date()
	),
	appealFactory(
		'HAS',
		{ status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date()
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'awaiting_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date()
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'awaiting_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date()
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'awaiting_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date()
	)
];

const appealsAwaitingLPAQuestionnaireOverdue = [
	appealFactory(
		'HAS',
		{ status: 'overdue_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2021, 10, 10)
	),
	appealFactory(
		'HAS',
		{ status: 'overdue_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2021, 10, 10)
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'overdue_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2021, 10, 10)
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'overdue_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2021, 10, 10)
	)
];

const appealsReadyForConfirmationFromCaseOfficer = [
	appealFactory(
		'HAS',
		{ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	),
	appealFactory(
		'HAS',
		{ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	),
	appealFactory(
		'HAS',
		{ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	),
	appealFactory(
		'HAS',
		{ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	),
	appealFactory(
		'HAS',
		{ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'received_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'received_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10)
	)
];

const appealsReviewIncomplete = [
	appealFactory(
		'HAS',
		{ status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		true
	),
	appealFactory(
		'HAS',
		{ status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		true
	),
	appealFactory(
		'HAS',
		{ status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'incomplete_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'incomplete_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'incomplete_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		true
	)
];

const appealsAvailableForInspectorPickup = [
	appealFactory(
		'HAS',
		{ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'HAS',
		{ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'HAS',
		{ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'HAS',
		{ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'HAS',
		{ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'available_for_inspector_pickup',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'available_for_inspector_pickup',
			'available_for_final_comments',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments',
			getDateTwoWeeksAgo()
		),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true
	)
];

const appealPickedUpButStillAcceptingFinalComments = [
	appealFactory(
		'FPA',
		buildCompoundState('picked_up', 'available_for_final_comments', getDateTwoWeeksAgo()),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true,
		true
	),
	appealFactory(
		'FPA',
		buildCompoundState('picked_up', 'available_for_statements', getDateTwoWeeksAgo()),
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true,
		true
	)
];

const appealsSiteVisitNotYetBooked = [
	appealFactory(
		'HAS',
		{ status: 'site_visit_not_yet_booked' },
		false,
		false,
		true,
		true,
		new Date(2022, 3, 1, 10),
		false,
		true,
		true
	),
	appealFactory(
		'HAS',
		{ status: 'site_visit_not_yet_booked' },
		false,
		false,
		true,
		true,
		new Date(2022, 4, 1, 11),
		false,
		true,
		true
	),
	appealFactory(
		'FPA',
		{ status: 'site_visit_not_yet_booked' },
		false,
		false,
		true,
		true,
		new Date(2022, 4, 1, 11),
		false,
		true,
		true
	)
];

const appealsWithBookedSiteVisit = [
	appealFactory(
		'HAS',
		{ status: 'site_visit_booked' },
		false,
		false,
		true,
		true,
		new Date(2022, 4, 1, 11),
		false,
		true,
		true,
		true
	)
];

const appealsWithDecisionDue = [
	appealFactory(
		'HAS',
		{ status: 'decision_due' },
		false,
		false,
		true,
		true,
		new Date(2022, 4, 1, 11),
		false,
		true,
		true,
		true
	)
];

const appealsData = [
	...newAppeals,
	...appealsAwaitingValidationInfo,
	...invalidAppeals,
	...appealsAwaitingLPAQuestionnaire,
	...appealsAwaitingLPAQuestionnaireOverdue,
	...appealsReviewIncomplete,
	...appealsReadyForConfirmationFromCaseOfficer,
	...appealsAvailableForInspectorPickup,
	...appealPickedUpButStillAcceptingFinalComments,
	...appealsSiteVisitNotYetBooked,
	...appealsWithBookedSiteVisit,
	...appealsWithDecisionDue
];

const deleteAllRecords = async () => {
	const deleteAppeals = prisma.appeal.deleteMany();
	const deleteUsers = prisma.user.deleteMany();
	const deleteAppealTypes = prisma.appealType.deleteMany();
	const deleteAddresses = prisma.address.deleteMany();
	const deleteAppealDetailsFromAppellant = prisma.appealDetailsFromAppellant.deleteMany();
	const deleteAppealStatus = prisma.appealStatus.deleteMany();
	const deleteAppellant = prisma.appellant.deleteMany();
	const deleteInspectorDecision = prisma.inspectorDecision.deleteMany();
	const deleteLPAQuestionnaire = prisma.lPAQuestionnaire.deleteMany();
	const deleteReviewQuestionnaire = prisma.reviewQuestionnaire.deleteMany();
	const deleteSiteVisit = prisma.siteVisit.deleteMany();
	const deleteValidationDecision = prisma.validationDecision.deleteMany();

	await prisma.$transaction([
		deleteAppealDetailsFromAppellant,
		deleteAppealStatus,
		deleteValidationDecision,
		deleteLPAQuestionnaire,
		deleteReviewQuestionnaire,
		deleteSiteVisit,
		deleteUsers,
		deleteAppealTypes,
		deleteAddresses,
		deleteInspectorDecision,
		deleteAppeals,
		deleteAppellant
	]);
};

/**
 *
 */
async function main() {
	try {
		await deleteAllRecords();
		await prisma.appealType.createMany({
			data: [
				{ shorthand: 'FPA', type: appealTypes.FPA },
				{ shorthand: 'HAS', type: appealTypes.HAS }
			]
		});
		for (const appealData of appealsData) {
			await prisma.appeal.create({ data: appealData });
		}
	} catch (error) {
		pino.error(error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

await main();
