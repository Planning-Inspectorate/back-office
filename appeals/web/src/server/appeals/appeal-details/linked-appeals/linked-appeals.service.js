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

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealReference
 * @returns {Promise<import('@pins/appeals.api/src/server/endpoints/linkable-appeals/linkable-appeal.service.js').LinkableAppealSummary>}
 */
export async function getLinkableAppealByReference(apiClient, appealReference) {
	return await apiClient.get(`appeals/linkable-appeal/${appealReference}`).json();
}
