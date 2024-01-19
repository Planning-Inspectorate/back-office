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
 * @returns {Promise<import('./change-appeal-type.types.js').AppealType[]>}
 */
export function getAppealTypesFromId(apiClient, appealId) {
	return apiClient.get(`appeals/${appealId}/appeal-types`).json();
}

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param { number } appealTypeId
 * @param {string|null} appealTypeFinalDate
 * @returns {Promise<import('./change-appeal-type.types.js').ChangeAppealTypeRequest>}
 */
export async function postChangeAppealType(apiClient, appealId, appealTypeId, appealTypeFinalDate) {
	return await apiClient
		.post(`appeals/${appealId}/appeal-change-request`, {
			json: { newAppealTypeId: appealTypeId, newAppealTypeFinalDate: appealTypeFinalDate }
		})
		.json();
}
