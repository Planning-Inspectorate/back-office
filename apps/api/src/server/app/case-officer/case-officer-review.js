/* eslint-disable complexity */
// import { validationResult } from 'express-validator';

const reviewIncomplete = function (body) {
	return ( false ?
		body.Reason.applicationPlanningOficersReportMissingOrIncorrect == true ||
		body.Reason.applicationPlansToReachDecisionMissingOrIncorrect  == true ||
		body.Reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect  == true ||
		body.Reason.policiesOtherRelevanPoliciesMissingOrIncorrect  == true ||
		body.Reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrect   == true ||
		body.Reason.siteConservationAreaMapAndGuidanceMissingOrIncorrect  == true ||
		body.Reason.siteListedBuildingDescriptionMissingOrIncorrect  == true ||
		body.Reason.thirdPartyApplicationNotificationMissingOrIncorrect  == true ||
		body.Reason.thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses  == true ||
		body.Reason.thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice  == true ||
		body.Reason.thirdPartyApplicationPublicityMissingOrIncorrect  == true ||
		body.Reason.thirdPartyRepresentationsMissingOrIncorrect  == true ||
		body.Reason.thirdPartyAppealNotificationMissingOrIncorrect  == true ||
		body.Reason.thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses  == true ||
		body.Reason.thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice  == true
		: true );
};

export { reviewIncomplete };
