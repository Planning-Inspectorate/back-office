import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_MAX_LENGTH_CHARACTERS,
	ERROR_MUST_BE_STRING,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED,
	MAX_LENGTH_4000
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateNumberArrayParameter from '#common/validators/number-array-parameter.js';
import errorMessageReplacement from '#utils/error-message-replacement.js';
import validateStringParameter from '#common/validators/string-parameter.js';
import validateBooleanParameter from '#common/validators/boolean-parameter.js';
import validateBooleanWithConditionalStringParameters from '#common/validators/boolean-with-conditional-string-parameters.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

const getAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantCaseId'),
	validationErrorHandler
);

const patchAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateDateParameter(
		'appealDueDate',
		(
			/** @type {any} */ value,
			/** @type {{ req: { body: { validationOutcome: string } } }} */ { req }
		) => {
			if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
			}

			return value;
		}
	),
	validateIdParameter('appellantCaseId'),
	validateNumberArrayParameter(
		'incompleteReasons',
		(
			/** @type {any} */ value,
			/** @type {{ req: { body: { validationOutcome: string } } }} */ { req }
		) => {
			if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
			}

			return value;
		}
	),
	validateNumberArrayParameter(
		'invalidReasons',
		(
			/** @type {any} */ value,
			/** @type {{ req: { body: { validationOutcome: string } } }} */ { req }
		) => {
			if (value && !isOutcomeInvalid(req.body.validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME);
			}

			return value;
		}
	),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.isLength({ min: 0, max: MAX_LENGTH_4000 })
		.withMessage(errorMessageReplacement(ERROR_MAX_LENGTH_CHARACTERS, [MAX_LENGTH_4000]))
		.custom((value, { req }) => {
			if (
				value &&
				!isOutcomeIncomplete(req.body.validationOutcome) &&
				!isOutcomeInvalid(req.body.validationOutcome)
			) {
				throw new Error(ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS);
			}

			return value;
		}),
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
