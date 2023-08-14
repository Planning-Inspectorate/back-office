import { appellantCaseReviewOutcomes } from '../../appeal.constants.js';

/**
 * @typedef {import('./appellant-case.types.js').SingleAppellantCaseResponse} AppellantCaseResponse
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseInvalidReason} AppellantCaseInvalidReason
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReason} AppellantCaseIncompleteReason
 */

/**
 * @param {import('got').Got} apiClient
 * @param {number} appealId
 * @param {number} appellantCaseId
 */
export function getAppellantCaseFromAppealId(apiClient, appealId, appellantCaseId) {
	return apiClient.get(`appeals/${appealId}/appellant-cases/${appellantCaseId}`).json();
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
 * @param {import('got').Got} apiClient
 * @param {number} appealId
 * @param {number} appellantCaseId
 * @param {AppellantCaseReviewOutcome} reviewOutcome
 * @returns {Promise<AppellantCaseResponse>}
 */
export async function setReviewOutcomeForAppellantCase(
	apiClient,
	appealId,
	appellantCaseId,
	reviewOutcome
) {
	return apiClient
		.patch(`appeals/${appealId}/appellant-cases/${appellantCaseId}`, {
			json: reviewOutcome
		})
		.json();
}

/**
 * @param {import('got').Got} apiClient
 * @returns {Promise<AppellantCaseInvalidReason[]>}
 */
export async function getAppellantCaseInvalidReasons(apiClient) {
	return apiClient.get(`appeals/appellant-case-invalid-reasons`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @returns {Promise<AppellantCaseIncompleteReason[]>}
 */
export async function getAppellantCaseIncompleteReasons(apiClient) {
	return apiClient.get(`appeals/appellant-case-incomplete-reasons`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} validationOutcome
 * @returns {Promise<AppellantCaseInvalidReason[]|AppellantCaseIncompleteReason[]>}
 */
export async function getAppellantCaseNotValidReasonsForOutcome(apiClient, validationOutcome) {
	switch (validationOutcome) {
		case appellantCaseReviewOutcomes.invalid:
			return getAppellantCaseInvalidReasons(apiClient);
		case appellantCaseReviewOutcomes.incomplete:
			return getAppellantCaseIncompleteReasons(apiClient);
		default:
			return [];
	}
}
