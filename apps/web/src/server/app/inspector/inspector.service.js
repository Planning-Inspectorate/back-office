import request from './../../lib/request.js';

/** @typedef {import('@pins/inspector').Appeal} Appeal */

/**
 * Fetch an appeal for validation.
 *
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {Promise<Appeal>} - A promise that resolves to the appeal.
 */
export function findAppealById(appealId) {
	// return request(`inspector/${appealId}`);

	return Promise.resolve({ AppealId: appealId });
}
