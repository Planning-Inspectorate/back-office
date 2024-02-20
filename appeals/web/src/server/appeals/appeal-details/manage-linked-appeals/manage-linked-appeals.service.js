/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {number} relationshipId
 * @returns {Promise<{}>}
 */
export function postUnlinkRequest(apiClient, appealId, relationshipId) {
	return apiClient
		.delete(`appeals/${appealId}/unlink-appeal`, {
			json: { relationshipId }
		})
		.json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealReference
 * @returns {Promise<import('@pins/appeals.api').Appeals.LinkableAppealSummary>}
 */
export async function getLinkableAppealByReference(apiClient, appealReference) {
	return apiClient.get(`appeals/linkable-appeal/${appealReference}`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} linkedAppealId
 * @param {boolean} [targetAppealIsParent]
 * @returns {Promise<{}>}
 */
export async function linkAppealToBackOfficeAppeal(
	apiClient,
	appealId,
	linkedAppealId,
	targetAppealIsParent = false
) {
	return apiClient
		.post(`appeals/${appealId}/link-appeal`, {
			json: {
				linkedAppealId,
				isCurrentAppealParent: targetAppealIsParent
			}
		})
		.json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} linkedAppealReference
 * @param {boolean} [targetAppealIsParent]
 * @returns {Promise<{}>}
 */
export async function linkAppealToLegacyAppeal(
	apiClient,
	appealId,
	linkedAppealReference,
	targetAppealIsParent = false
) {
	return apiClient
		.post(`appeals/${appealId}/link-legacy-appeal`, {
			json: {
				linkedAppealReference,
				isCurrentAppealParent: targetAppealIsParent
			}
		})
		.json();
}
