import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { body } from 'express-validator';
import { difference } from 'lodash-es';
import multer from 'multer';
import { validationErrorHandler } from '../../middleware/error-handler.js';
import { handleValidationError } from '../../middleware/handle-validation-error.js';
import { validateAppealStatus } from '../../middleware/validate-appeal-status.js';
import { appealStates } from '../../utils/transition-state.js';

export const validateAppealBelongsToCaseTeam = validateAppealStatus([
	appealStates.received_lpa_questionnaire,
	appealStates.incomplete_lpa_questionnaire,
	appealStates.overdue_lpa_questionnaire
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

const invalidWithoutReasons = (hasExplanation) => {
	return !!(
		(hasExplanation.reason.applicationPlansToReachDecisionMissingOrIncorrect === true &&
			typeof hasExplanation.reason.applicationPlansToReachDecisionMissingOrIncorrectDescription ===
				'undefined') ||
		(hasExplanation.reason.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect === true &&
			typeof hasExplanation.reason
				.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription === 'undefined') ||
		(hasExplanation.reason.policiesOtherRelevanPoliciesMissingOrIncorrect === true &&
			typeof hasExplanation.reason.policiesOtherRelevanPoliciesMissingOrIncorrectDescription ===
				'undefined') ||
		(hasExplanation.reason.policiesSupplementaryPlanningDocumentsMissingOrIncorrect === true &&
			typeof hasExplanation.reason
				.policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription === 'undefined') ||
		(hasExplanation.reason.siteConservationAreaMapAndGuidanceMissingOrIncorrect === true &&
			typeof hasExplanation.reason
				.siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription === 'undefined') ||
		(hasExplanation.reason.siteListedBuildingDescriptionMissingOrIncorrect === true &&
			typeof hasExplanation.reason.siteListedBuildingDescriptionMissingOrIncorrectDescription ===
				'undefined') ||
		(hasExplanation.reason.thirdPartyApplicationNotificationMissingOrIncorrect === true &&
			hasExplanation.reason.thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses ===
				false &&
			hasExplanation.reason
				.thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice === false) ||
		(hasExplanation.reason.thirdPartyRepresentationsMissingOrIncorrect === true &&
			typeof hasExplanation.reason.thirdPartyRepresentationsMissingOrIncorrectDescription ===
				'undefined') ||
		(hasExplanation.reason.thirdPartyAppealNotificationMissingOrIncorrect === true &&
			hasExplanation.reason.thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses ===
				false &&
			hasExplanation.reason
				.thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice === false)
	);
};

const incompleteWithUnexpectedReasons = (reasonListed) => {
	return (
		difference(Object.keys(reasonListed.reason), [
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
		]).length > 0
	);
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

export const validateFilesUpload = (filename) => {
	return composeMiddleware(
		multer({
			storage: multer.memoryStorage(),
			limits: {
				/* MBs */
				fileSize: 15 * 1024 ** 2
			}
		}).array(filename),
		mapMulterErrorToValidationError,
		body(filename)
			.custom((_, { req }) => req.files.length > 0)
			.withMessage('Select a file'),
		handleValidationError
	);
};
