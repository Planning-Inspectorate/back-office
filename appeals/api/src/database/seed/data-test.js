/**
 * Test data used for development and testing
 */
import { AUDIT_TRAIL_SYSTEM_UUID } from '#endpoints/constants.js';
import {
	addressesList,
	addressListForTrainers,
	appellantCaseList,
	appellantsList,
	agentsList,
	completeValidationDecisionSample,
	incompleteReviewQuestionnaireSample,
	incompleteValidationDecisionSample,
	invalidValidationDecisionSample,
	localPlanningDepartmentList,
	lpaQuestionnaireList,
	neighbouringSiteContactsList
} from './data-samples.js';
import isFPA from '#utils/is-fpa.js';
import { calculateTimetable } from '#utils/business-days.js';
import {
	//APPEAL_TYPE_SHORTHAND_FPA,
	APPEAL_TYPE_SHORTHAND_HAS,
	STATE_TARGET_COMPLETE,
	STATE_TARGET_ISSUE_DETERMINATION,
	STATE_TARGET_READY_TO_START,
	STATE_TARGET_ASSIGN_CASE_OFFICER
} from '#endpoints/constants.js';

import { mapDefaultCaseFolders } from '#endpoints/documents/documents.mapper.js';

/** @typedef {import('@pins/appeals.api').Appeals.AppealSite} AppealSite */

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

	return `TEST/${number}`;
}

/**
 *
 * @param {object[] | string[]} list
 * @returns {number}
 */
const pickRandom = (list) => Math.floor(Math.random() * list.length);

/**
 *
 * @param {string} lpaQuestionnaireAndInspectorPickupState
 * @param {string} statementsAndFinalCommentsState
 * @param {Date} createdAt
 * @returns {{status: string, createdAt: Date, subStateMachineName: string, compoundStateName: string}[]}
 */
// const buildCompoundState = (
// 	lpaQuestionnaireAndInspectorPickupState,
// 	statementsAndFinalCommentsState,
// 	createdAt = new Date()
// ) => {
// 	return [
// 		{
// 			status: lpaQuestionnaireAndInspectorPickupState,
// 			createdAt,
// 			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
// 			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
// 		},
// 		{
// 			status: statementsAndFinalCommentsState,
// 			createdAt,
// 			subStateMachineName: 'statementsAndFinalComments',
// 			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
// 		}
// 	];
// };

/**
 *
 * @param {{
 * 	typeShorthand: string,
 * 	statuses?: object,
 * 	incompleteValidationDecision?: boolean,
 *  invalidValidationDecision?: boolean,
 *  completeValidationDecision?: boolean,
 *  lpaQuestionnaire?: boolean,
 *  startedAt?: Date | null,
 *  incompleteReviewQuestionnaire?: boolean,
 *  completeReviewQuestionnaire?: boolean,
 *  siteAddressList?: AppealSite[],
 *  assignCaseOfficer: boolean}} param0
 * @returns {object}
 */
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
	siteAddressList = addressesList,
	assignCaseOfficer = false
}) => {
	const appellantInput = appellantsList[pickRandom(appellantsList)];
	const agentInput = agentsList[pickRandom(agentsList)];
	const lpaInput = localPlanningDepartmentList[pickRandom(localPlanningDepartmentList)];

	return {
		appealType: { connect: { shorthand: typeShorthand } },
		reference: generateAppealReference(),
		startedAt,
		appealStatus: { create: statuses },
		appellantCase: { create: appellantCaseList[typeShorthand] },
		appellant: {
			create: {
				name: `${appellantInput.firstName} ${appellantInput.lastName}`,
				customer: {
					connectOrCreate: {
						where: { email: appellantInput.email },
						create: appellantInput
					}
				}
			}
		},
		agent: {
			create: {
				name: `${agentInput.firstName} ${agentInput.lastName}`,
				customer: {
					connectOrCreate: {
						where: { email: agentInput.email },
						create: agentInput
					}
				}
			}
		},
		lpa: {
			connectOrCreate: {
				where: { lpaCode: lpaInput.lpaCode },
				create: lpaInput
			}
		},
		planningApplicationReference: '48269/APP/2021/1482',
		address: { create: siteAddressList[pickRandom(siteAddressList)] },
		...(assignCaseOfficer && {
			caseOfficer: {
				connectOrCreate: {
					where: { azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID },
					create: { azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID }
				}
			}
		}),
		...(incompleteValidationDecision && {
			validationDecision: { create: incompleteValidationDecisionSample }
		}),
		...(invalidValidationDecision && {
			validationDecision: { create: invalidValidationDecisionSample }
		}),
		...(completeValidationDecision && {
			validationDecision: { create: completeValidationDecisionSample }
		}),
		...(lpaQuestionnaire && { lpaQuestionnaire: { create: lpaQuestionnaireList[typeShorthand] } }),
		...(incompleteReviewQuestionnaire && {
			reviewQuestionnaire: { create: incompleteReviewQuestionnaireSample }
		}),
		...(completeReviewQuestionnaire && { reviewQuestionnaire: { create: { complete: true } } })
	};
};

const newAppeals = [
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_HAS, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	/*
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	appealFactory({ typeShorthand: APPEAL_TYPE_SHORTHAND_FPA, assignCaseOfficer: false }),
	*/
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'ready_to_start', createdAt: getDateTwoWeeksAgo() },
		assignCaseOfficer: true
	})
];

const appealsLpaQuestionnaireDue = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	})
	/*
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	})
	*/
];

/*
const appealsStatementReview = [

	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'statement_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'statement_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'statement_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'statement_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'statement_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	})
];

const appealsFinalCommentReview = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'final_comment_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'final_comment_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'final_comment_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'final_comment_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_FPA,
		statuses: { status: 'final_comment_review', valid: true },
		completeValidationDecision: true,
		completeReviewQuestionnaire: true,
		lpaQuestionnaire: true,
		startedAt: new Date(),
		assignCaseOfficer: true
	})
];
*/

const appealsArrangeSiteVisit = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 2, 10),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 5, 3, 10),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 6, 4, 9),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'lpa_questionnaire_due' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 7, 5, 8),
		assignCaseOfficer: true
	})
];

const appealsIssueDetermination = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 5, 2, 10),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 6, 3, 9),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 7, 4, 8),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 8, 5, 7),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	})
];

const appealsComplete = [
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'complete' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'complete' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 5, 2, 10),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'complete' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 6, 3, 9),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'complete' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 7, 4, 8),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_TYPE_SHORTHAND_HAS,
		statuses: { status: 'complete' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 8, 5, 7),
		completeReviewQuestionnaire: true,
		assignCaseOfficer: true
	})
];

const appealsData = [
	...newAppeals,
	...appealsLpaQuestionnaireDue,
	//...appealsStatementReview,
	//...appealsFinalCommentReview,
	...appealsArrangeSiteVisit,
	...appealsIssueDetermination,
	...appealsComplete
];

/**
 * @param {import('#db-client').PrismaClient} databaseConnector
 */
export async function seedTestData(databaseConnector) {
	const appeals = [];

	for (const appealData of appealsData) {
		// @ts-ignore
		const appeal = await databaseConnector.appeal.create({ data: appealData });
		await databaseConnector.folder.createMany({ data: mapDefaultCaseFolders(appeal.id) });
		appeals.push(appeal);
	}

	const lpaQuestionnaires = await databaseConnector.lPAQuestionnaire.findMany();
	const designatedSites = await databaseConnector.designatedSite.findMany();
	const lpaNotificationMethods = await databaseConnector.lPANotificationMethods.findMany();
	const addresses = await databaseConnector.address.findMany();

	for (const lpaQuestionnaire of lpaQuestionnaires) {
		await databaseConnector.designatedSitesOnLPAQuestionnaires.createMany({
			data: [1, 2].map((item) => ({
				designatedSiteId: designatedSites[item].id,
				lpaQuestionnaireId: lpaQuestionnaire.id
			}))
		});

		await databaseConnector.listedBuildingDetails.createMany({
			data: ['123456', '654321', '789012', '210987'].map((listEntry, index) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				listEntry,
				affectsListedBuilding: index > 1
			}))
		});

		await databaseConnector.lPANotificationMethodsOnLPAQuestionnaires.createMany({
			data: [1, 2].map((item) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				notificationMethodId: lpaNotificationMethods[item].id
			}))
		});

		if (lpaQuestionnaire.isAffectingNeighbouringSites) {
			await databaseConnector.neighbouringSiteContact.createMany({
				data: [1, 2].map(() => ({
					...neighbouringSiteContactsList[pickRandom(neighbouringSiteContactsList)],
					addressId: addresses[pickRandom(addresses)].id,
					lpaQuestionnaireId: lpaQuestionnaire.id
				}))
			});
		}
	}

	const linkedAppealGroups = [
		[appeals[0].id, appeals[1].id, appeals[2].id],
		[appeals[3].id, appeals[4].id, appeals[5].id],
		[appeals[6].id, appeals[7].id, appeals[8].id],
		[appeals[9].id, appeals[10].id, appeals[11].id],
		[appeals[12].id, appeals[13].id],
		[appeals[14].id, appeals[15].id],
		[appeals[16].id, appeals[17].id],
		[appeals[18].id, appeals[19].id],
		[appeals[20].id, appeals[21].id]
	];

	await Promise.all(
		linkedAppealGroups
			.map((linkedAppealGroup) =>
				linkedAppealGroup.map((linkedAppeal) =>
					databaseConnector.appeal.update({
						where: { id: linkedAppeal },
						data: { linkedAppealId: linkedAppealGroup[0], otherAppealId: linkedAppealGroup[0] }
					})
				)
			)
			.flat()
	);

	const appealTypes = await databaseConnector.appealType.findMany();
	const appealStatus = await databaseConnector.appealStatus.findMany();
	const siteVisitType = await databaseConnector.siteVisitType.findMany();

	for (const { appealTypeId, id, startedAt } of appeals) {
		if (startedAt) {
			const appealType = appealTypes.filter(({ id }) => id === appealTypeId)[0].shorthand;
			const appealTimetable = await calculateTimetable(appealType, startedAt);

			await databaseConnector.appealTimetable.create({
				data: {
					appealId: id,
					...appealTimetable
				}
			});
		}

		const statusWithSiteVisitSet = appealStatus.find(
			({ appealId, status, valid }) =>
				appealId === id &&
				valid &&
				[STATE_TARGET_ISSUE_DETERMINATION, STATE_TARGET_COMPLETE].includes(status)
		);

		if (statusWithSiteVisitSet) {
			await databaseConnector.siteVisit.create({
				data: {
					appealId: id,
					visitDate: new Date(),
					visitEndTime: '16:00',
					visitStartTime: '14:00',
					siteVisitTypeId: siteVisitType[pickRandom(siteVisitType)].id
				}
			});
		}
	}

	const appellantCases = await databaseConnector.appellantCase.findMany();
	const planningObligationStatus = await databaseConnector.planningObligationStatus.findFirst();
	const knowledgeOfOtherLandowners = await databaseConnector.knowledgeOfOtherLandowners.findMany({
		where: {
			name: 'Some'
		}
	});
	const validationOutcomes = await databaseConnector.appellantCaseValidationOutcome.findMany({
		orderBy: {
			name: 'asc'
		}
	});
	const appellantCaseIncompleteReasons =
		await databaseConnector.appellantCaseIncompleteReason.findMany();
	const appellantCaseInvalidReasons = await databaseConnector.appellantCaseInvalidReason.findMany();

	const appellantCaseValidationOutcomes = [
		{
			validationOutcomeId: validationOutcomes[0].id,
			incompleteReasons: appellantCaseIncompleteReasons.map(({ id }) => id)
		},
		{
			validationOutcomeId: validationOutcomes[1].id,
			invalidReasons: appellantCaseInvalidReasons.map(({ id }) => id)
		},
		{
			validationOutcomeId: validationOutcomes[2].id
		}
	];

	for (const appellantCase of appellantCases) {
		const appeal = appeals.find(({ id }) => id === appellantCase.appealId);
		const status = appealStatus.find(({ appealId }) => appealId === appellantCase.appealId);
		const appealType = appealTypes.find(({ id }) => id === appeal?.appealTypeId);
		const validationOutcome =
			status?.status !== STATE_TARGET_READY_TO_START &&
			status?.status !== STATE_TARGET_ASSIGN_CASE_OFFICER
				? appellantCaseValidationOutcomes[2]
				: null;

		await databaseConnector.appellantCase.update({
			where: { id: appellantCase.id },
			data: {
				hasAdvertisedAppeal: null,
				...(appealType &&
					isFPA(appealType) && { planningObligationStatusId: planningObligationStatus?.id }),
				...(!appellantCase.isSiteFullyOwned && {
					hasAdvertisedAppeal: true,
					knowledgeOfOtherLandownersId: knowledgeOfOtherLandowners[0].id
				}),
				...(validationOutcome && {
					appellantCaseValidationOutcomeId: validationOutcome.validationOutcomeId
				})
			}
		});

		if (validationOutcome?.incompleteReasons) {
			await databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany({
				data: validationOutcome?.incompleteReasons.map((item) => ({
					appellantCaseIncompleteReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
			await databaseConnector.appeal.update({
				where: { id: appellantCase.appealId },
				data: { dueDate: new Date() }
			});
		}

		if (validationOutcome?.invalidReasons) {
			await databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany({
				data: validationOutcome?.invalidReasons.map((item) => ({
					appellantCaseInvalidReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
		}
	}
}
