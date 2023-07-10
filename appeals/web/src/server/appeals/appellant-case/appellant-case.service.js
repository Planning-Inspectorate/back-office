import { get, patch } from '../../lib/request.js';

/**
 * @typedef {import('./appellant-case.types.js').SingleAppellantCaseResponse} AppellantCaseResponse
 */

/**
 * @param {number} appealId
 * @param {number} appellantCaseId
 */
export function getAppellantCaseFromAppealId(appealId, appellantCaseId) {
	return get(`appeals/${appealId}/appellant-cases/${appellantCaseId}`);
}

/**
 * @typedef {Object} AppellantCaseReviewOutcome
 * @property {string} validationOutcome
 * @property {number[]} [invalidReasons]
 * @property {number[]} [incompleteReasons]
 * @property {string} [otherNotValidReasons] - free text field for "other" (shared by both invalid and incomplete outcomes)
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
 * @returns {Promise<import('.prisma/client').AppellantCaseInvalidReason[]>}
 */
export async function getAppellantCaseInvalidReasons() {
	return get(`appeals/appellant-case-invalid-reasons`);
}
