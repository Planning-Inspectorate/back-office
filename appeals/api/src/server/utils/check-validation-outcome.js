import {
	VALIDATION_OUTCOME_INCOMPLETE,
	VALIDATION_OUTCOME_INVALID,
	VALIDATION_OUTCOME_VALID
} from '#endpoints/constants.js';

/**
 * @param {string} validationOutcomeParameter
 * @param {string} validationOutcomeConstant
 * @returns {boolean}
 */
const compareValidationOutcome = (validationOutcomeParameter, validationOutcomeConstant) =>
	validationOutcomeParameter.toLowerCase() === validationOutcomeConstant.toLowerCase();

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeIncomplete = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_INCOMPLETE);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeInvalid = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_INVALID);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeValid = (validationOutcome) =>
	compareValidationOutcome(validationOutcome, VALIDATION_OUTCOME_VALID);

export { isOutcomeIncomplete, isOutcomeInvalid, isOutcomeValid };
