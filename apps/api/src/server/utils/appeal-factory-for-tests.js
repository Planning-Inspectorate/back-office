import { isEmpty } from 'lodash-es';
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
} from '../../../src/database/seed/data-samples.js';

/**
 * @returns {string}
 */
function generateAppealReference() {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `APP/Q9999/D/21/${number}`;
}

const appealTypes = {
	HAS: 'household',
	FPA: 'full planning'
};

/**
 * @param {object} list
 * @returns {number} list
 */
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

export const appealFactoryForTests = ({
	appealId,
	statuses,
	typeShorthand,
	inclusions = {},
	dates = {}
}) => {
	const validationDecisions = [];

	if (inclusions.completeValidationDecision) {
		validationDecisions.push(completeValidationDecisionSample);
	}
	if (inclusions.incompleteValidationDecision) {
		validationDecisions.push(incompleteValidationDecisionSample);
	}
	if (inclusions.invalidValidationDecision) {
		validationDecisions.push(invalidValidationDecisionSample);
	}
	return {
		id: appealId,
		appealType: { shorthand: typeShorthand, type: appealTypes[typeShorthand] },
		reference: generateAppealReference(),
		createdAt: dates.createdAt || new Date(),
		updatedAt: dates.updatedAt || new Date(),
		startedAt: dates.startedAt || new Date(),
		appealStatus: statuses,
		appellant: pickRandom(appellantsList),
		localPlanningDepartment: pickRandom(localPlanningDepartmentList),
		planningApplicationReference: '48269/APP/2021/1482',
		address: pickRandom(addressesList),
		...(inclusions.lpaQuestionnaire && { lpaQuestionnaire: pickRandom(lpaQuestionnaireList) }),
		...(!isEmpty(validationDecisions) && { validationDecision: validationDecisions }),
		...(inclusions.incompleteReviewQuestionnaire && [
			{ reviewQuestionnaire: incompleteReviewQuestionnaireSample }
		]),
		...(inclusions.completeReviewQuestionnaire && [{ reviewQuestionnaire: { complete: true } }]),
		appealDetailsFromAppellant: pickRandom(appealDetailsFromAppellantList),
		...(inclusions.connectToUser && { user: { id: 1, azureReference: 1 }, userId: 1 }),
		...(inclusions.siteVisitBooked && {
			siteVisit: {
				visitDate: new Date(2022, 3, 1),
				visitSlot: '1pm - 2pm',
				visitType: 'unaccompanied'
			}
		})
	};
};
