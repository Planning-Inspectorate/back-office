import sub from 'date-fns/sub/index.js';
import { createAddress } from '../factory/address.js';
import { createAppealStatus } from '../factory/appeal-status.js';
import { createAppeal } from '../factory/appeal.js';
import { createAppellant } from '../factory/appellant.js';
import { createReviewQuestionnaire } from '../factory/review-questionnaire.js';
import { caseOfficer } from '../formatters/appeal.js';
import { documents } from './document.js';
import { lpaQuestionnaire } from './lpa-questionnaire.js';

/** @typedef {import('../factory/appeal').Appeal} Appeal */
/** @typedef {import('../factory/appeal').AppealData} AppealData */
/** @typedef {import('@pins/appeals').Lpa.Appeal} LpaAppeal */
/** @typedef {import('@pins/appeals').Lpa.AppealSummary} LpaAppealSummary */

/**
 * @param {Partial<AppealData> & { id: number }} appealData
 * @returns {[LpaAppealSummary, LpaAppeal]}
 */
const createAppealFixtures = ({ id, ...appealData }) => {
	const appeal = createAppeal({
		id,
		planningApplicationReference: `00/01/${String(id).padStart(4, '0')}`,
		localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
		reference: `LPA/A0000/A/00/0000${id}`,
		createdAt: sub(new Date(), { days: id }),
		startedAt: sub(new Date(), { days: id }),
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

	return [caseOfficer.formatAppealSummary(appeal), caseOfficer.formatAppealDetails(appeal)];
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
