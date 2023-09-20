/**
 * @typedef {Object} AllocationDetailsLevel
 * @property {string} level
 * @property {number} band
 */

/**
 * @typedef {Object} AllocationDetailsSpecialism
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} AllocationDetails
 * @property {number[]} specialisms
 * @property {string} level
 */

/**
 *
 * @param {import('got').Got} apiClient
 * @returns {Promise<AllocationDetailsLevel[]>}
 */
export async function getAllocationDetailsLevels(apiClient) {
	return apiClient.get('appeals/appeal-allocation-levels').json();
}

/**
 *
 * @param {import('got').Got} apiClient
 * @returns {Promise<AllocationDetailsSpecialism[]>}
 */
export async function getAllocationDetailsSpecialisms(apiClient) {
	return apiClient.get('appeals/appeal-allocation-specialisms').json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {AllocationDetails} allocationDetails
 * @returns {Promise<AllocationDetails>}
 */
export function setAllocationDetails(apiClient, appealId, allocationDetails) {
	return apiClient
		.patch(`appeals/${appealId}/appeal-allocation`, { json: allocationDetails })
		.json();
}
