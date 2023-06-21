import { get } from '../../lib/request.js';

/**
 * @param {number} appealId
 * @param {number} appellantCaseId
 */
export function getAppellantCaseFromAppealId(appealId, appellantCaseId) {
	return get(`appeals/${appealId}/appellant-cases/${appellantCaseId}`);
}
