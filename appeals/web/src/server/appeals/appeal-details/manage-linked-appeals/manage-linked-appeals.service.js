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
	return apiClient.get(`appeals/linkable-appeal/${appealReference}`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} linkedAppealId
 * @param {boolean} [targetAppealIsParent]
 * @returns {Promise<{}>}
 */
export async function linkAppealToBackOfficeAppeal(apiClient, appealId, linkedAppealId, targetAppealIsParent = false) {
	return apiClient.post(`appeals/${appealId}/link-appeal`, {
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
export async function linkAppealToLegacyAppeal(apiClient, appealId, linkedAppealReference, targetAppealIsParent = false) {
	return apiClient.post(`appeals/${appealId}/link-legacy-appeal`, {
		json: {
			linkedAppealReference, // TODO: think this may need 'HORIZON' to be prepended...
			isCurrentAppealParent: targetAppealIsParent
		}
	})
	.json();
}
