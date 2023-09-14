import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateStringParameter from '#common/validators/string-parameter.js';
import validateBooleanParameter from '#common/validators/boolean-parameter.js';
import validateBooleanWithConditionalStringParameters from '#common/validators/boolean-with-conditional-string-parameters.js';
import validateIncompleteInvalidReasonParameter from '#common/validators/incomplete-invalid-reason-parameter.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

const getAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantCaseId'),
	validationErrorHandler
);

const patchAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateDateParameter({
		parameterName: 'appealDueDate',
		mustBeFutureDate: true,
		customFn: (
			/** @type {any} */ value,
			/** @type {{ req: { body: { validationOutcome: string } } }} */ { req }
		) => {
			if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
			}

			return value;
		}
	}),
	validateIdParameter('appellantCaseId'),
	validateIncompleteInvalidReasonParameter('incompleteReasons'),
	validateIncompleteInvalidReasonParameter('invalidReasons'),
	body('validationOutcome')
		.optional()
		.isString()
		.custom((value, { req }) => {
			if (isOutcomeIncomplete(value) && !req.body.incompleteReasons) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED);
			}

			if (isOutcomeInvalid(value) && !req.body.invalidReasons) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED);
			}

			return value;
		}),
	validateStringParameter('applicantFirstName'),
	validateStringParameter('applicantSurname'),
	validateBooleanParameter('isSiteFullyOwned'),
	validateBooleanParameter('isSitePartiallyOwned'),
	validateBooleanParameter('areAllOwnersKnown'),
	validateBooleanParameter('hasAttemptedToIdentifyOwners'),
	validateBooleanParameter('hasAdvertisedAppeal'),
	validateBooleanWithConditionalStringParameters(
		'isSiteVisibleFromPublicRoad',
		'visibilityRestrictions',
		false
	),
	validateBooleanWithConditionalStringParameters(
		'hasHealthAndSafetyIssues',
		'healthAndSafetyIssues',
		true
	),
	validationErrorHandler
);

export { getAppellantCaseValidator, patchAppellantCaseValidator };
