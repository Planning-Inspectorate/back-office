// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable complexity */
// import { validationResult } from 'express-validator';
const reviewComplete = function (body) {
	return ((
		body.reason.applicationPlanningOficersReportMissingOrIncorrect == true ||
		body.reason.applicationPlansToReachDecisionMissingOrIncorrect  == true ||
		body.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect  == true ||
		body.reason.policiesOtherRelevanPoliciesMissingOrIncorrect  == true ||
		body.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrect   == true ||
		body.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrect  == true ||
		body.reason.siteListedBuildingDescriptionMissingOrIncorrect  == true ||
		body.reason.thirdPartyApplicationNotificationMissingOrIncorrect  == true ||
		body.reason.thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses  == true ||
		body.reason.thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice  == true ||
		body.reason.thirdPartyApplicationPublicityMissingOrIncorrect  == true ||
		body.reason.thirdPartyRepresentationsMissingOrIncorrect  == true ||
		body.reason.thirdPartyAppealNotificationMissingOrIncorrect  == true ||
		body.reason.thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses  == true ||
		body.reason.thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice  == true ) ?
		false : true );
};

export { reviewComplete };
