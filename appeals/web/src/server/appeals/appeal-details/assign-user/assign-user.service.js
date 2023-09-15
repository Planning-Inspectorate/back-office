/** @typedef {import('../appeal-details.types').Appeal} Appeal */

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string|null} assigneeUserId
 * @param {boolean} isInspector
 * @returns {Promise<Appeal>}
 */
export async function setAppealAssignee(apiClient, appealId, assigneeUserId, isInspector) {
	return await apiClient
		.patch(`appeals/${appealId}`, {
			json: isInspector ? { inspector: assigneeUserId } : { caseOfficer: assigneeUserId }
		})
		.json();
}
