import { get } from '../../lib/request.js';

/** @typedef {import('../applications.types').Sector} Sector */

/**
 * Get the list of sector for an application
 *
 * @returns {Promise<Sector[]>}
 */
export const getAllSectors = () => {
	return get(`applications/sector`);
};

/**
 * // TODO: this is just a mock.
 *
 * @returns {Promise<any>}
 */
export const createApplication = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ id: 123 });
		}, 1000);
	});
};
