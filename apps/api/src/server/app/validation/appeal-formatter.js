import formatAddress from '../utils/address-formatter.js';
import formatDate from '../utils/date-formatter.js';
import { appealStates } from '../state-machine/transition-state.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js'

const appealAwaitingValidationInfo = function(appeal) {
	return arrayOfStatusesContainsString(appeal.appealStatus, [appealStates.awaiting_validation_info])
};

/**
 * @param {string} status appeal status
 * @returns {string} reformatted appeal status
 */
function mapAppealStatus(appeal) {
	return appealAwaitingValidationInfo(appeal) ? 'incomplete' : 'new';
}

const formatIncompleteReason = function(incompleteValidationDecision) {
	return {
		reasons: {
			...(incompleteValidationDecision.namesDoNotMatch && { namesDoNotMatch: incompleteValidationDecision.namesDoNotMatch }),
			...(incompleteValidationDecision.sensitiveInfo && { sensitiveInfo: incompleteValidationDecision.sensitiveInfo }),
			...(incompleteValidationDecision.missingApplicationForm && { missingApplicationForm: incompleteValidationDecision.missingApplicationForm }),
			...(incompleteValidationDecision.missingDecisionNotice && { missingDecisionNotice: incompleteValidationDecision.missingDecisionNotice }),
			...(incompleteValidationDecision.missingGroundsForAppeal && { missingGroundsForAppeal: incompleteValidationDecision.missingGroundsForAppeal }),
			...(incompleteValidationDecision.missingSupportingDocuments && {
				missingSupportingDocuments: incompleteValidationDecision.missingSupportingDocuments }),
			...(incompleteValidationDecision.inflammatoryComments && { inflammatoryComments: incompleteValidationDecision.inflammatoryComments }),
			...(incompleteValidationDecision.openedInError && { openedInError: incompleteValidationDecision.openedInError }),
			...(incompleteValidationDecision.wrongAppealTypeUsed && { wrongAppealTypeUsed: incompleteValidationDecision.wrongAppealTypeUsed }),
			...(incompleteValidationDecision.otherReasons && { otherReasons: incompleteValidationDecision.otherReasons })
		}
	};
};

const appealFormatter = {
	formatAppealForAllAppeals: function(appeal) {
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			AppealStatus: mapAppealStatus(appeal),
			Received: formatDate(appeal.createdAt),
			AppealSite: formatAddress(appeal.address)
		};
	},
	formatAppealForAppealDetails: function(appeal) {
		const incompleteValidationDecision = appeal.validationDecision.find((decision) => decision.decision == 'incomplete');
		const validationDecision = appealAwaitingValidationInfo(appeal) ?
			formatIncompleteReason(incompleteValidationDecision) :
			{};
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			AppellantName: appeal.appellant.name,
			AppealStatus: mapAppealStatus(appeal),
			Received: formatDate(appeal.createdAt),
			AppealSite: formatAddress(appeal.address),
			LocalPlanningDepartment: appeal.localPlanningDepartment,
			PlanningApplicationReference: appeal.planningApplicationReference,
			Documents: [
				{
					Type: 'planning application form',
					Filename: 'planning-application.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'decision letter',
					Filename: 'decision-letter.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'appeal statement',
					Filename: 'appeal-statement.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-1.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-2.pdf',
					URL: 'localhost:8080'
				},
				{
					Type: 'supporting document',
					Filename: 'other-document-3.pdf',
					URL: 'localhost:8080'
				}
			],
			...validationDecision
		};
	}
};

export default appealFormatter;
