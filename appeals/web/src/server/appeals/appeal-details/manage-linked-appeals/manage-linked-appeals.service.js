/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @returns {Promise<import('../appeal-details.types.js').WebAppeal>}
 */
export function getAppealDetailsFromId(apiClient, appealId) {
	console.log('getAppealDetailsFromId', appealId);
	return apiClient.get(`appeals/${appealId}`).json();
}

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} linkedAppealReference
 * @returns {Promise<{}>}
 */
export function postUnlinkRequest(apiClient, appealId, linkedAppealReference) {
	return apiClient
		.delete(`appeals/${appealId}/unlink-appeal`, {
			json: { linkedAppealReference: linkedAppealReference }
		})
		.json();
}
