import { createAddress } from '../factory/address.js';
import { createAppeal } from '../factory/appeal.js';
import { createAppealStatus } from '../factory/appeal-status.js';
import { createAppellant } from '../factory/appellant.js';
import { createReviewQuestionnaire } from '../factory/review-questionnaire.js';
import { CaseTeam } from '../formatters/appeal.js';
import { documents } from './document.js';
import { lpaQuestionnaire } from './lpa-questionnaire.js';

/** @typedef {import('@pins/appeals').CaseTeam.Appeal} CaseTeamAppeal */
/** @typedef {import('@pins/appeals').CaseTeam.AppealSummary} CaseTeamAppealSummary */

/**
 * @param {Partial<import('../factory/appeal').AppealData> & { id: number }} appealData
 * @returns {[CaseTeamAppealSummary, CaseTeamAppeal]}
 */
const createAppealFixtures = ({ id, ...appealData }) => {
	const appeal = createAppeal({
		id,
		planningApplicationReference: `00/01/${String(id).padStart(4, '0')}`,
		localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
		reference: `LPA/A0000/A/00/0000${id}`,
		createdAt: new Date(2022, 0, 1),
		startedAt: new Date(2022, 0, 7),
		appellant: createAppellant({ name: `Cliff Montgomery ${id}` }),
		address: createAddress({
			addressLine1: `London Industrial Park – Unit ${id}`,
			addressLine2: 'Alpine Way',
			town: 'London',
			postcode: 'E6 6LA'
		}),
		documents,
		...appealData
	});

	return [CaseTeam.formatAppealSummary(appeal), CaseTeam.formatAppealDetails(appeal)];
};

export const [appealSummaryForReceivedQuestionnaire, appealDetailsForReceivedQuestionnaire] =
	createAppealFixtures({
		id: 201,
		appealStatus: [createAppealStatus({ status: 'received_lpa_questionnaire' })],
		lpaQuestionnaire
	});

export const [appealSummaryForPendingQuestionnaire] = createAppealFixtures({
	id: 202,
	appealStatus: [createAppealStatus({ status: 'awaiting_lpa_questionnaire' })]
});

export const [appealSummaryForOverdueQuestionnaire] = createAppealFixtures({
	id: 203,
	appealStatus: [createAppealStatus({ status: 'overdue_lpa_questionnaire' })]
});

export const [appealSummaryForIncompleteQuestionnaire, appealDetailsForIncompleteQuestionnaire] =
	createAppealFixtures({
		id: 204,
		appealStatus: [createAppealStatus({ status: 'incomplete_lpa_questionnaire' })],
		lpaQuestionnaire,
		reviewQuestionnaire: [
			createReviewQuestionnaire({
				applicationPlanningOfficersReportMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: 'A',
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: true,
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription: 'B',
				policiesOtherRelevantPoliciesMissingOrIncorrect: true,
				policiesOtherRelevantPoliciesMissingOrIncorrectDescription: 'C',
				policiesSupplementaryPlanningDocumentsMissingOrIncorrect: true,
				policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription: 'D',
				siteConservationAreaMapAndGuidanceMissingOrIncorrect: true,
				siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription: 'E',
				siteListedBuildingDescriptionMissingOrIncorrect: true,
				siteListedBuildingDescriptionMissingOrIncorrectDescription: 'F',
				thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: true,
				thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: true,
				thirdPartyApplicationNotificationMissingOrIncorrect: true,
				thirdPartyApplicationPublicityMissingOrIncorrect: true,
				thirdPartyRepresentationsMissingOrIncorrect: true,
				thirdPartyRepresentationsMissingOrIncorrectDescription: 'G',
				thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: true,
				thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: true,
				thirdPartyAppealNotificationMissingOrIncorrect: true
			})
		]
	});

export const [appealSummaryForFinalComments, appealDetailsForFinalComments] = createAppealFixtures({
	id: 205,
	appealStatus: [createAppealStatus({ status: 'available_for_final_comments' })]
});

export const [appealSummaryForStatements, appealDetailsForStatements] = createAppealFixtures({
	id: 206,
	appealStatus: [createAppealStatus({ status: 'available_for_statements' })]
});
