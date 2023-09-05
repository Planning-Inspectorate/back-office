/** @typedef {import('../appeal-details.types').Appeal} Appeal */

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} caseOfficerUserId
 * @returns {Object}
 */
export function setAssignedCaseOfficer(apiClient, appealId, caseOfficerUserId) {
	// TODO: update once API functionality to set the case officer is available
	// return await apiClient
	// 	.patch(`appeals/${appealId}/case-officers`, {
	// 		json: caseOfficerUserId
	// 	})
	// 	.json();
	return {
		statusCode: 200,
		apiClient,
		appealId,
		caseOfficerUserId
	};
}
