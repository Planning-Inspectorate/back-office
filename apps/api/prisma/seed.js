import Prisma from '@prisma/client';
import { 
	appellantsList, 
	localPlanningDepartmentList, 
	addressesList, 
	lpaQuestionnaireList, 
	appealDetailsFromAppellantList, 
	incompleteReviewQuestionnaireSample,
	incompleteValidationDecisionSample,
	invalidValidationDecisionSample,
	completeValidationDecisionSample
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

function generateAppealReference() {
	const number = Math.floor(
		Math.random() * (1 - 999_999) + 1
	);
	return `APP/Q9999/D/21/${number}`;
}

function pickRandom(list) {
	return list[Math.floor(Math.random()*list.length)];
}

const appealFactory = function(
	statuses = {}, 
	incompleteValidationDecision = false,
	invalidValidationDecision = false,
	completeValidationDecision = false,
	lpaQuestionnaire = false,
	startedAt = undefined,
	incompleteReviewQuestionnaire = false,
	completeReviewQuestionnaire = false,
	connectToUser = false,
	siteVisitBooked = false
) {
	return {
		reference: generateAppealReference(),
		startedAt: startedAt,
		appealStatus: { create: statuses },
		appellant: { create: pickRandom(appellantsList) },
		localPlanningDepartment: pickRandom(localPlanningDepartmentList),
		planningApplicationReference: '48269/APP/2021/1482',
		address: { create: pickRandom(addressesList) },
		...(incompleteValidationDecision && { validationDecision: { create: incompleteValidationDecisionSample } }),
		...(invalidValidationDecision && { validationDecision: { create: invalidValidationDecisionSample } }),
		...(completeValidationDecision && { validationDecision: { create: completeValidationDecisionSample } }),
		...(lpaQuestionnaire && { lpaQuestionnaire: { create: pickRandom(lpaQuestionnaireList) } }),
		...(incompleteReviewQuestionnaire && { reviewQuestionnaire: { create: incompleteReviewQuestionnaireSample } }),
		...(completeReviewQuestionnaire && { reviewQuestionnaire: { create: { complete: true } } }),
		appealDetailsFromAppellant: { create: pickRandom(appealDetailsFromAppellantList) },
		...(connectToUser && { user: { connect: { id: 1 } } }),
		...(siteVisitBooked && { siteVisit: { create: { visitDate: new Date(2022, 3, 1), visitSlot: '1pm - 2pm', visitType: 'unaccompanied' } }	})
	};
};

const newAppeals = [
	appealFactory(),
	appealFactory(),
	appealFactory(),
	appealFactory(),
	appealFactory(),
	appealFactory()
];

const appealsAwaitingValidationInfo = [
	appealFactory({ status: 'awaiting_validation_info' }, true)
];

const invalidAppeals = [
	appealFactory({ status: 'invalid_appeal' }, false, true)
];

const appealsAwaitingLPAQuestionnaire = [
	appealFactory({ status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date())
];

const appealsAwaitingLPAQuestionnaireOverdue = [
	appealFactory({ status: 'overdue_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2021, 10, 10))
];

const appealsReadyForConfirmationFromCaseOfficer = [
	appealFactory({ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10)),
	appealFactory({ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10)),
	appealFactory({ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10)),
	appealFactory({ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10)),
	appealFactory({ status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10))
];

const appealsReviewIncomplete = [
	appealFactory({ status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10), true),
	appealFactory({ status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10), true),
	appealFactory({ status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() }, false, false, true, true, new Date(2022, 3, 1, 10), true),
];

const appealsAvailableForInspectorPickup = [
	appealFactory({ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() }, 
		false, false, true, true, new Date(2022, 3, 1, 10), false, true),
	appealFactory({ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() }, 
		false, false, true, true, new Date(2022, 3, 1, 10), false, true),
	appealFactory({ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() }, 
		false, false, true, true, new Date(2022, 3, 1, 10), false, true),
	appealFactory({ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() }, 
		false, false, true, true, new Date(2022, 3, 1, 10), false, true),
	appealFactory({ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() }, 
		false, false, true, true, new Date(2022, 3, 1, 10), false, true),
	appealFactory({ status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() }, 
		false, false, true, true, new Date(2022, 3, 1, 10), false, true)
];

const appealsSiteVisitNotYetBooked = [
	appealFactory({ status: 'site_visit_not_yet_booked' },
		false, false, true, true, new Date(2022, 3, 1, 10), false, true, true),
	appealFactory({ status: 'site_visit_not_yet_booked' },
		false, false, true, true, new Date(2022, 4, 1, 11), false, true, true)
];

const appealsWithBookedSiteVisit = [
	appealFactory({ status: 'site_visit_booked' },
		false, false, true, true, new Date(2022, 4, 1, 11), false, true, true, true)
];

const appealsWithDecisionDue = [
	appealFactory({ status: 'decision_due' },
		false, false, true, true, new Date(2022, 4, 1, 11), false, true, true, true)
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
	...appealsSiteVisitNotYetBooked,
	...appealsWithBookedSiteVisit,
	...appealsWithDecisionDue
];

/**
 *
 */
async function main() {
	try {
		await prisma.user.create({ data: {} });
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
