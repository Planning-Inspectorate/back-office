import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { body } from 'express-validator';
import { difference } from 'lodash-es';
import multer from 'multer';
import { validationErrorHandler } from '../middleware/error-handler.js';
import { handleValidationError } from '../middleware/handle-validation-error.js';
import { validateAppealStatus } from '../middleware/validate-appeal-status.js';
import { appealStates } from '../state-machine/transition-state.js';

export const validateAppealBelongsToCaseOfficer = validateAppealStatus([
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
	for (const [questionnaireKey, questionnaireValue] of Object.entries(hasExplanation.reason)) {
		if (questionnaireValue === true) {
			for (const [questionnaireSecondaryKey, questionnaireSecondaryValue] of Object.entries(
				hasExplanation.reason
			)) {
				if (`${questionnaireKey}Description` in Object.keys(hasExplanation.reason) === false) {
					return false;
				}
				if (
					questionnaireSecondaryKey === `${questionnaireKey}Description` &&
					typeof questionnaireSecondaryValue === 'undefined'
				) {
					return false;
				}
				if (
					(questionnaireSecondaryKey === `${questionnaireKey}ListOfAddresses` ||
						questionnaireSecondaryKey === `${questionnaireKey}CopyOfLetterOrSiteNotice`) &&
					questionnaireSecondaryValue === false
				) {
					return false;
				}
			}
		}
	}
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
	if (incompleteWithUnexpectedReasons(request.body)) {
		response.status(409).send({
			errors: {
				status: 'Incomplete Review requires a known description'
			}
		});
	} else if (invalidWithoutReasons(request.body)) {
		response.status(409).send({
			errors: {
				status: 'Incomplete Review requires a description'
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
