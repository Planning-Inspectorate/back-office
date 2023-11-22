/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @returns {Promise<import('./appeal-details.types.js').WebAppeal>}
 */
export function getAppealDetailsFromId(apiClient, appealId) {
	return apiClient.get(`appeals/${appealId}`).json();
}
