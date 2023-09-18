import { appellantCaseReviewOutcomes } from '../../appeal.constants.js';

/**
 * @typedef {import('./appellant-case.types.js').SingleAppellantCaseResponse} AppellantCaseResponse
 */

/**
 * @typedef {Object} AppellantCaseInvalidIncompleteReasonOption
 * @property {boolean} hasText
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} AppellantCaseInvalidIncompleteReason
 * @property {AppellantCaseInvalidIncompleteReasonOption} name
 * @property {string[]} [text]
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
 * @typedef {Object} AppellantCaseReviewOutcomeReason
 * @property {number} id
 * @property {string[]} [text]
 */

/**
 * @typedef {Object} AppellantCaseReviewOutcome
 * @property {string} validationOutcome
 * @property {AppellantCaseReviewOutcomeReason[]} [invalidReasons]
 * @property {AppellantCaseReviewOutcomeReason[]} [incompleteReasons]
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
 * @returns {Promise<AppellantCaseInvalidIncompleteReasonOption[]>}
 */
async function getAppellantCaseInvalidReasonOptions(apiClient) {
	return apiClient.get(`appeals/appellant-case-invalid-reasons`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @returns {Promise<AppellantCaseInvalidIncompleteReasonOption[]>}
 */
async function getAppellantCaseIncompleteReasonOptions(apiClient) {
	return apiClient.get(`appeals/appellant-case-incomplete-reasons`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} validationOutcome
 * @returns {Promise<AppellantCaseInvalidIncompleteReasonOption[]>}
 */
export async function getAppellantCaseNotValidReasonOptionsForOutcome(
	apiClient,
	validationOutcome
) {
	switch (validationOutcome) {
		case appellantCaseReviewOutcomes.invalid:
			return getAppellantCaseInvalidReasonOptions(apiClient);
		case appellantCaseReviewOutcomes.incomplete:
			return getAppellantCaseIncompleteReasonOptions(apiClient);
		default:
			return [];
	}
}
