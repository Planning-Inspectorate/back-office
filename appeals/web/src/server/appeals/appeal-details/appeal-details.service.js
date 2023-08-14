/** @typedef {import('./appeal-details.types').Appeal} Appeal */

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @returns {Promise<Appeal>}
 */
export function getAppealDetailsFromId(apiClient, appealId) {
	return apiClient.get(`appeals/${appealId}`).json();
}
