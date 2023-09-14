import {
	ERROR_MUST_BE_INCOMPLETE_INVALID_REASON,
	ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME,
	ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME,
	LENGTH_1,
	LENGTH_10
} from '#endpoints/constants.js';
import { isOutcomeIncomplete, isOutcomeInvalid } from '#utils/check-validation-outcome.js';
import { body } from 'express-validator';

/** @typedef {import('express-validator').ValidationChain} ValidationChain */
/** @typedef {import('@pins/appeals.api').Appeals.IncompleteInvalidReasons} IncompleteInvalidReasons */

/**
 * @param {IncompleteInvalidReasons} incompleteInvalidReasons
 * @returns {boolean}
 */
const validateIncompleteInvalidReasons = (incompleteInvalidReasons) =>
	incompleteInvalidReasons.every((reason) => {
		if (typeof reason.id === 'number') {
			if (typeof reason.text === 'object') {
				return (
					reason.text.every((text) => typeof text === 'string') && reason.text.length <= LENGTH_10
				);
			}
			return true;
		}
	});

/**
 * @param {IncompleteInvalidReasons} incompleteInvalidReasons
 * @returns {IncompleteInvalidReasons}
 */
const removeEmptyIncompleteInvalidReasons = (incompleteInvalidReasons) =>
	incompleteInvalidReasons.map(({ id, text }) => ({
		id: id,
		text: text && text.filter((text) => text.trim() && text)
	}));

/**
 * @param {string} parameterName
 * @returns {ValidationChain}
 */
const validateIncompleteInvalidReasonParameter = (parameterName) => {
	return body(parameterName)
		.optional()
		.isArray({ min: LENGTH_1 })
		.withMessage(ERROR_MUST_BE_INCOMPLETE_INVALID_REASON)
		.bail()
		.customSanitizer((value) => removeEmptyIncompleteInvalidReasons(value))
		.custom((value) => validateIncompleteInvalidReasons(value))
		.withMessage(ERROR_MUST_BE_INCOMPLETE_INVALID_REASON)
		.custom((value, { req }) => {
			const { incompleteReasons, invalidReasons, validationOutcome } = req.body;

			if (incompleteReasons && !isOutcomeIncomplete(validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INCOMPLETE_VALIDATION_OUTCOME);
			}

			if (invalidReasons && !isOutcomeInvalid(validationOutcome)) {
				throw new Error(ERROR_ONLY_FOR_INVALID_VALIDATION_OUTCOME);
			}

			return value;
		});
};

export default validateIncompleteInvalidReasonParameter;
