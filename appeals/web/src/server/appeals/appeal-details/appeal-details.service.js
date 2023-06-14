import { get } from '../../lib/request.js';
/** @typedef {import('./appeal-details.types').Appeal} Appeal */

/**
 *
 * @param {string} appealId
 * @returns {Promise<Appeal>}
 */
export function getAppealDetailsFromId(appealId) {
	return get(`appeals/${appealId}`);
}
