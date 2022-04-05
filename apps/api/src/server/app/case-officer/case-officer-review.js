/* eslint-disable complexity */
import CaseOfficerError from './case-officer-error.js';

const reviewComplete = function (body) {
	return ((
		body.reason.applicationPlanningOfficersReportMissingOrIncorrect == true ||
		body.reason.applicationPlansToReachDecisionMissingOrIncorrect  == true ||
		body.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect  == true ||
		body.reason.policiesOtherRelevantPoliciesMissingOrIncorrect  == true ||
		body.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrect   == true ||
		body.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrect  == true ||
		body.reason.siteListedBuildingDescriptionMissingOrIncorrect  == true ||
		body.reason.thirdPartyApplicationNotificationMissingOrIncorrect  == true ||
		body.reason.thirdPartyApplicationPublicityMissingOrIncorrect  == true ||
		body.reason.thirdPartyRepresentationsMissingOrIncorrect  == true ||
		body.reason.thirdPartyAppealNotificationMissingOrIncorrect  == true
	)?
		false : true );
};

const invalidWithoutReasons = function (body) {
	return ((
		(body.reason.applicationPlansToReachDecisionMissingOrIncorrect  == true &&
		body.reason.applicationPlansToReachDecisionMissingOrIncorrectDescription == undefined) ||
		(body.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect == true &&
		body.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription == undefined) ||
		(body.reason.policiesOtherRelevanPoliciesMissingOrIncorrect == true &&
		body.reason.policiesOtherRelevanPoliciesMissingOrIncorrectDescription == undefined) ||
		(body.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrect == true &&
		body.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription == undefined) ||
		(body.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrect == true &&
		body.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription == undefined) ||
		(body.reason.siteListedBuildingDescriptionMissingOrIncorrect == true &&
		body.reason.siteListedBuildingDescriptionMissingOrIncorrectDescription == undefined) ||
		(body.reason.thirdPartyApplicationNotificationMissingOrIncorrect == true &&
			(body.reason.thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses == false &&
			body.reason.thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice == false)) ||
		(body.reason.thirdPartyRepresentationsMissingOrIncorrect == true &&
		body.reason.thirdPartyRepresentationsMissingOrIncorrectDescription == undefined) ||
		(body.reason.thirdPartyAppealNotificationMissingOrIncorrect == true &&
			(body.reason.thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses == false &&
			body.reason.thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice == false))
	)?
		true : false);
};

const validateReviewRequest = function(body) {
	// if (invalidAppealStatus(body.AppealStatus)) {
	// 	throw new ValidationError('Unknown AppealStatus provided', 400);
	// }
	// if (invalidWithUnexpectedReasons(body) || incompleteWithUnexpectedReasons(body)) {
	// 	throw new ValidationError('Unknown Reason provided', 400);
	// }
	if (invalidWithoutReasons(body)) {
		throw new CaseOfficerError('Incomplete Review requires a description', 400);
	}
	// if (incompleteWithoutReasons(body)) {
	// 	throw new ValidationError('Incomplete Appeal requires a reason', 400);
	// }
	// if (validWithoutDescription(body)) {
	// 	throw new ValidationError('Valid Appeals require Description of Development', 400);
	// }
};

export { reviewComplete, validateReviewRequest };
