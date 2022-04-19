import CaseOfficerError from './case-officer-error.js';
import _ from 'lodash';

// the questionnaire review is not completed until all the points in the review are completed as well.
// This validation establishes the status of an appeal as complete or incomplete according to this criteria
const reviewComplete = function (body) {
	return Object.keys(body.reason).every((index) => !body.reason[index])? true : false;
};

// TODO: Refactor this to make it more readable.
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

const validateReviewRequest = function(body) {
	if (invalidWithoutReasons(body)) {
		throw new CaseOfficerError('Incomplete Review requires a description', 400);
	}
	if (incompleteWithUnexpectedReasons(body)) {
		throw new CaseOfficerError('Incomplete Review requires a known description', 400);
	}
};

export { reviewComplete, validateReviewRequest };
