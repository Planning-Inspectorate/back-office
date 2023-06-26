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
 * @param {number} appealId
 * @param {number} appellantCaseId
 * @param {string} validationOutcome
 * @returns {Promise<AppellantCaseResponse>}
 */
export async function setReviewOutcomeForAppellantCase(
	appealId,
	appellantCaseId,
	validationOutcome
) {
	return patch(`appeals/${appealId}/appellant-cases/${appellantCaseId}`, {
		json: {
			validationOutcome
		}
	});
}
