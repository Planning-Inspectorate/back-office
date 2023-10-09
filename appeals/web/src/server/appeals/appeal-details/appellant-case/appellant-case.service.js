/**
 * @typedef {import('../appeal-details.types.js').NotValidReasonOption} NotValidReasonOption
 * @typedef {import('./appellant-case.types.js').SingleAppellantCaseResponse} AppellantCaseResponse
 * @typedef {import('./appellant-case.types.js').AppellantCaseValidationOutcome} AppellantCaseValidationOutcome
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
 * @param {import('got').Got} apiClient
 * @param {number} appealId
 * @param {number} appellantCaseId
 * @param {import('./appellant-case.types.js').AppellantCaseValidationOutcomeRequest} reviewOutcome
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
 * @returns {Promise<NotValidReasonOption[]>}
 */
async function getAppellantCaseInvalidReasonOptions(apiClient) {
	return apiClient.get(`appeals/appellant-case-invalid-reasons`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @returns {Promise<NotValidReasonOption[]>}
 */
async function getAppellantCaseIncompleteReasonOptions(apiClient) {
	return apiClient.get(`appeals/appellant-case-incomplete-reasons`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {AppellantCaseValidationOutcome} validationOutcome
 * @returns {Promise<NotValidReasonOption[]>}
 */
export async function getAppellantCaseNotValidReasonOptionsForOutcome(
	apiClient,
	validationOutcome
) {
	switch (validationOutcome) {
		case 'invalid':
			return getAppellantCaseInvalidReasonOptions(apiClient);
		case 'incomplete':
			return getAppellantCaseIncompleteReasonOptions(apiClient);
		default:
			return [];
	}
}
