import { patch } from '../../lib/request.js';
/** @typedef {import('../appeal-details/appeal-details.types').Appeal} Appeal */

/**
 *
 * @param {string} appealId
 * @param {object} date
 * @returns {Promise<Appeal>}
 */
export function setStartDateById(appealId, date) {
	return patch(`appeals/${appealId}`, { json: date });
}
