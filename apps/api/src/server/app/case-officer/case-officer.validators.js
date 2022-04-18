import _ from 'lodash';

const invalidWithoutReasons = function (body) {
	return ((
		(body.reason.applicationPlansToReachDecisionMissingOrIncorrect  === true &&
		body.reason.applicationPlansToReachDecisionMissingOrIncorrectDescription === undefined) ||
		(body.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect === true &&
		body.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription === undefined) ||
		(body.reason.policiesOtherRelevanPoliciesMissingOrIncorrect === true &&
		body.reason.policiesOtherRelevanPoliciesMissingOrIncorrectDescription === undefined) ||
		(body.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrect === true &&
		body.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription === undefined) ||
		(body.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrect === true &&
		body.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription == undefined) ||
		(body.reason.siteListedBuildingDescriptionMissingOrIncorrect === true &&
		body.reason.siteListedBuildingDescriptionMissingOrIncorrectDescription === undefined) ||
		(body.reason.thirdPartyApplicationNotificationMissingOrIncorrect === true &&
			(body.reason.thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses === false &&
			body.reason.thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice === false)) ||
		(body.reason.thirdPartyRepresentationsMissingOrIncorrect === true &&
		body.reason.thirdPartyRepresentationsMissingOrIncorrectDescription === undefined) ||
		(body.reason.thirdPartyAppealNotificationMissingOrIncorrect === true &&
			(body.reason.thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses === false &&
			body.reason.thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice === false))
	)?
		true : false);
};

const incompleteWithUnexpectedReasons = function (body) {
	return (_.difference(Object.keys(body.reason), [
		'applicationPlanningOfficersReportMissingOrIncorrect',
		'applicationPlansToReachDecisionMissingOrIncorrect',
		'applicationPlansToReachDecisionMissingOrIncorrectDescription',
		'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect',
		'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription',
		'policiesOtherRelevantPoliciesMissingOrIncorrect',
		'policiesOtherRelevantPoliciesMissingOrIncorrectDescription',
		'policiesSupplementaryPlanningDocumentsMissingOrIncorrect',
		'policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription',
		'siteConservationAreaMapAndGuidanceMissingOrIncorrect',
		'siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription',
		'siteListedBuildingDescriptionMissingOrIncorrect',
		'siteListedBuildingDescriptionMissingOrIncorrectDescription',
		'thirdPartyApplicationNotificationMissingOrIncorrect',
		'thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses',
		'thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice',
		'thirdPartyApplicationPublicityMissingOrIncorrect',
		'thirdPartyRepresentationsMissingOrIncorrect',
		'thirdPartyRepresentationsMissingOrIncorrectDescription',
		'thirdPartyAppealNotificationMissingOrIncorrect',
		'thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses',
		'thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice'
	]).length === 0)? false : true;
};

export const validateReviewRequest = (request, response, next) => {
	if (invalidWithoutReasons(request.body)) {
		response.status(409).send({
			errors: {
				status: 'Incomplete Review requires a description'
			}
		});
	} else if (incompleteWithUnexpectedReasons(request.body)) {
		response.status(409).send({
			errors: {
				status: 'Incomplete Review requires a known description'
			}
		});
	} else {
		next();
	}
};
