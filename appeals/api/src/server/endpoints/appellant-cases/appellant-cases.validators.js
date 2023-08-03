import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import {
	ERROR_MAX_LENGTH_300_CHARACTERS,
	ERROR_MUST_BE_STRING,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateValidationOutcomeReasons from '#common/validators/validation-outcome-reasons.js';

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
	validateValidationOutcomeReasons(
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
	validateValidationOutcomeReasons(
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
		.isLength({ min: 0, max: 300 })
		.withMessage(ERROR_MAX_LENGTH_300_CHARACTERS)
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
	validationErrorHandler
);

export { getAppellantCaseValidator, patchAppellantCaseValidator };
