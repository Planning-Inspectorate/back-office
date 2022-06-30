import { mockedApplication } from '../../../../testing/applications/fixtures/case-officer.js';
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
 * @param {any} payload
 * @returns {Promise<any>}
 */
export const updateApplicationDraft = (payload) => {
	const mockedResponse = !payload.id ? { id: 123 } : mockedApplication;

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockedResponse);
		}, 1000);
	});
};

/**
 * // TODO: this is just a mock.
 *
 * @param {string} id
 * @returns {Promise<any>}
 */
export const getApplicationDraft = (id) => {
	const mockedResponse = id === '123' ? { id: 123 } : mockedApplication;

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockedResponse);
		}, 1000);
	});
};
