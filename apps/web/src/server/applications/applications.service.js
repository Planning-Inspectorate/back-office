import { get } from '../lib/request.js';

/** @typedef {import('./applications.types').Case} Case */

/**
 * @returns {Promise<import('./applications.types').Case[]>}
 */
export const findOpenCases = () => {
	return get(`applications`);
};
