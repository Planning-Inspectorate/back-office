/**
 * @typedef {import('./issue-decision.types.js').InspectorDecisionRequest} InspectorDecisionRequest
 */

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @returns {Promise<import('../appeal-details.types.js').WebAppeal>}
 */
export function getAppealDetailsFromId(apiClient, appealId) {
	return apiClient.get(`appeals/${appealId}`).json();
}

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string|null} outcome
 * @param {string|null} documentGuid
 * @param {string|null} documentDate
 * @returns {Promise<InspectorDecisionRequest>}
 */
export async function postInspectorDecision(
	apiClient,
	appealId,
	outcome,
	documentGuid,
	documentDate
) {
	return await apiClient
		.post(`appeals/${appealId}/inspector-decision`, {
			json: { outcome: outcome, documentGuid: documentGuid, documentDate: documentDate }
		})
		.json();
}

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} invalidReason
 * @returns {Promise<InspectorDecisionRequest>}
 */
export async function postInspectorInvalidReason(apiClient, appealId, invalidReason) {
	return await apiClient
		.post(`appeals/${appealId}/inspector-decision-invalid`, {
			json: { invalidDecisionReason: invalidReason }
		})
		.json();
}
