import { get, patch } from '../../../lib/request.js';
import { appellantCaseReviewOutcomes } from '../../appeal.constants.js';

/**
 * @typedef {import('./appellant-case.types.js').SingleAppellantCaseResponse} AppellantCaseResponse
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseInvalidReason} AppellantCaseInvalidReason
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReason} AppellantCaseIncompleteReason
 */

/**
 * @param {number} appealId
 * @param {number} appellantCaseId
 */
export function getAppellantCaseFromAppealId(appealId, appellantCaseId) {
	return get(`appeals/${appealId}/appellant-cases/${appellantCaseId}`);
}

/**
 * @typedef {Object} DayMonthYear
 * @property {number} day
 * @property {number} month
 * @property {number} year
 */

/**
 * @typedef {Object} AppellantCaseReviewOutcome
 * @property {string} validationOutcome
 * @property {number[]} [invalidReasons]
 * @property {number[]} [incompleteReasons]
 * @property {string} [otherNotValidReasons] - free text field for "other" (shared by both invalid and incomplete outcomes)
 * @property {string} [appealDueDate]
 */

/**
 * @param {number} appealId
 * @param {number} appellantCaseId
 * @param {AppellantCaseReviewOutcome} reviewOutcome
 * @returns {Promise<AppellantCaseResponse>}
 */
export async function setReviewOutcomeForAppellantCase(appealId, appellantCaseId, reviewOutcome) {
	return patch(`appeals/${appealId}/appellant-cases/${appellantCaseId}`, {
		json: reviewOutcome
	});
}

/**
 * @returns {Promise<AppellantCaseInvalidReason[]>}
 */
export async function getAppellantCaseInvalidReasons() {
	return get(`appeals/appellant-case-invalid-reasons`);
}

/**
 * @returns {Promise<AppellantCaseIncompleteReason[]>}
 */
export async function getAppellantCaseIncompleteReasons() {
	return get(`appeals/appellant-case-incomplete-reasons`);
}

/**
 * @param {string} validationOutcome
 * @returns {Promise<AppellantCaseInvalidReason[]|AppellantCaseIncompleteReason[]>}
 */
export async function getAppellantCaseNotValidReasonsForOutcome(validationOutcome) {
	switch (validationOutcome) {
		case appellantCaseReviewOutcomes.invalid:
			return getAppellantCaseInvalidReasons();
		case appellantCaseReviewOutcomes.incomplete:
			return getAppellantCaseIncompleteReasons();
		default:
			return [];
	}
}
