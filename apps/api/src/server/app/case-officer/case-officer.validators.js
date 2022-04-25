import { body } from 'express-validator';
import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { validationErrorHandler } from '../middleware/error-handler.js';
import { difference } from 'lodash-es';
import { validateAppealStatus } from '../middleware/validate-appeal-status.js';
import { appealStates } from '../state-machine/transition-state.js';
import multer from 'multer';
import { handleValidationError } from '../middleware/handle-validation-error.js';

export const validateAppealBelongsToCaseOfficer = validateAppealStatus([
	appealStates.received_lpa_questionnaire,
	appealStates.incomplete_lpa_questionnaire
]);

export const validateAppealHasIncompleteQuestionnaire = validateAppealStatus([
	appealStates.incomplete_lpa_questionnaire
]);

export const validateAppealDetails = composeMiddleware(
	body('listedBuildingDescription')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter a description')
		.isLength({ max: 500 })
		.withMessage('Description must be 500 characters or fewer'),
	validationErrorHandler
);

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
	return (difference(Object.keys(body.reason), [
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

export const validateFilesUpload = function(filename) {
	return composeMiddleware(
		multer({
			storage: multer.memoryStorage(),
			limits: {
				fileSize: 15 * Math.pow(1024, 2 /* MBs*/)
			}
		}).array(filename),
		mapMulterErrorToValidationError,
		body(filename)
			.custom((_, { req }) => req.files.length > 0)
			.withMessage('Select a file'),
		handleValidationError
	);
};
