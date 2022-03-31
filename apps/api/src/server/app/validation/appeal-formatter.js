import formatAddress from '../utils/address-formatter.js';
import { validation_states_strings } from '../state-machine/validation-states.js';
import formatDate from '../utils/date-formatter.js';

/**
 * @param {string} status appeal status
 * @returns {string} reformatted appeal status
 */
function mapAppealStatus(status) {
	return status == validation_states_strings.received_appeal ? 'new' : 'incomplete';
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
			...(incompleteValidationDecision.inflamatoryComments && { inflamatoryComments: incompleteValidationDecision.inflamatoryComments }),
			...(incompleteValidationDecision.openedInError && { openedInError: incompleteValidationDecision.openedInError }),
			...(incompleteValidationDecision.wrongAppealTypeUsed && { wrongAppealTypeUsed: incompleteValidationDecision.wrongAppealTypeUsed }),
			...(incompleteValidationDecision.otherReasons && { otherReasons: incompleteValidationDecision.otherReasons })
		}
	};
};

const appealFormatter = {
	formatAppealForAllAppeals: function(appeal) {
		const address = appeal.address;
		const addressAsJson = formatAddress(address);
		const appealStatus = mapAppealStatus(appeal.status);
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			AppealStatus: appealStatus,
			Received: formatDate(appeal.createdAt),
			AppealSite: addressAsJson
		};
	},
	formatAppealForAppealDetails: function(appeal) {
		const address = appeal.address;
		const addressAsJson = formatAddress(address);
		const appealStatus = mapAppealStatus(appeal.status);
		const incompleteValidationDecision = appeal.ValidationDecision.find((decision) => decision.decision == 'incomplete');
		const validationDecision = appeal.status == 'awaiting_validation_info' ? 
			formatIncompleteReason(incompleteValidationDecision) : 
			{};
		return {
			AppealId: appeal.id,
			AppealReference: appeal.reference,
			AppellantName: appeal.appellantName,
			AppealStatus: appealStatus,
			Received: formatDate(appeal.createdAt),
			AppealSite: addressAsJson,
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
