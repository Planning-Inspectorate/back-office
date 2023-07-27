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
	TEXTAREA_MAXIMUM_CHARACTERS
} from '../constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import validateDateParameter from '#common/validators/date-parameter.js';
import validateIdParameter from '#common/validators/id-parameter.js';
import validateValidationOutcomeReasons from '#common/validators/validation-outcome-reasons.js';

const getAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	validateIdParameter('appellantCaseId'),
	validationErrorHandler
);

const patchAppellantCaseValidator = composeMiddleware(
	validateIdParameter('appealId'),
	// @ts-ignore
	validateDateParameter('appealDueDate', (value, { req }) => {
		if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
			throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
		}

		return value;
	}),
	validateIdParameter('appellantCaseId'),
	// @ts-ignore
	validateValidationOutcomeReasons('incompleteReasons', (value, { req }) => {
		if (value && !isOutcomeIncomplete(req.body.validationOutcome)) {
			throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
		}

		return value;
	}),
	// @ts-ignore
	validateValidationOutcomeReasons('invalidReasons', (value, { req }) => {
		if (value && !isOutcomeInvalid(req.body.validationOutcome)) {
			throw new Error(ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME);
		}

		return value;
	}),
	body('otherNotValidReasons')
		.optional()
		.isString()
		.withMessage(ERROR_MUST_BE_STRING)
		.custom((value) => {
			return value.replace(/[\0\r\n\f]/g, '').length <= TEXTAREA_MAXIMUM_CHARACTERS;
		})
		.withMessage(
			ERROR_MAX_LENGTH_CHARACTERS.replace(
				'{{maximumCharacters}}',
				String(TEXTAREA_MAXIMUM_CHARACTERS)
			)
		)
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
