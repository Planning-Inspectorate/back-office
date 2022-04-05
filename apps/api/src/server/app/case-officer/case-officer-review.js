/* eslint-disable complexity */

import CaseOfficerError from './case-officer-error.js';
import _ from 'lodash';

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

const allArrayElementsInArray = function(arrayToCheck, arrayToCheckAgainst) {
	return _.difference(arrayToCheck, arrayToCheckAgainst).length === 0;
};

const incompleteWithUnexpectedReasons = function (body) {
	return !allArrayElementsInArray(Object.keys(body.reason), [
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
	]);
};

const validateReviewRequest = function(body) {
	if (invalidWithoutReasons(body)) {
		throw new CaseOfficerError('Incomplete Review requires a description', 400);
	}
	if (incompleteWithUnexpectedReasons(body)) {
		throw new CaseOfficerError('Incomplete Review requires a known description', 400);
	}
};

export { reviewComplete, validateReviewRequest };
