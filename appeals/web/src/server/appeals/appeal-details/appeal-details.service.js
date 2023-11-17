/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @returns {Promise<import('@pins/appeals.api').Appeals.SingleAppealDetailsResponse>}
 */
export function getAppealDetailsFromId(apiClient, appealId) {
	return apiClient.get(`appeals/${appealId}`).json();
}
