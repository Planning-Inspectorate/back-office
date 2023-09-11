import {
	VALIDATION_OUTCOME_INCOMPLETE,
	VALIDATION_OUTCOME_INVALID,
	VALIDATION_OUTCOME_VALID
} from '#endpoints/constants.js';
import checkStringsMatch from './check-strings-match.js';

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeIncomplete = (validationOutcome) =>
	checkStringsMatch(validationOutcome, VALIDATION_OUTCOME_INCOMPLETE);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeInvalid = (validationOutcome) =>
	checkStringsMatch(validationOutcome, VALIDATION_OUTCOME_INVALID);

/**
 * @param {string} validationOutcome
 * @returns {boolean}
 */
const isOutcomeValid = (validationOutcome) =>
	checkStringsMatch(validationOutcome, VALIDATION_OUTCOME_VALID);

export { isOutcomeIncomplete, isOutcomeInvalid, isOutcomeValid };
