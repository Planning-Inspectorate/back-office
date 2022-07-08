import { fixtureApplications } from '../../../../../testing/applications/fixtures/applications.js';
import { get } from '../../../lib/request.js';

/** @typedef {import('../../applications.types.js').Sector} Sector */
/** @typedef {import('../../applications.types.js').Application} Application */
/** @typedef {import('../../applications.types.js').Region} Region */

/**
 * Get the list of sector for an application
 *
 * @returns {Promise<Sector[]>}
 */
export const getAllSectors = () => {
	return get(`applications/sector`);
};

/**
 * Get all sub-sectors associated with existing sector
 *
 * @param {Sector} sector
 * @returns {Promise<Sector[]>}
 */
export const getSubSectorsBySector = (sector) => {
	const sectorName = sector?.name || '';

	return get(`applications/sector?sectorName=${sectorName}`);
};

/**
 * Get all geographical regions
 *
 * @returns {Promise<Region[]>}
 */
export const getAllRegions = () => {
	return get(`applications/region`);
};

/**
 * // TODO: this is just a mock.
 *
 * @param {string} applicationId
 * @param {any} newData
 * @returns {Promise<any>}
 */
export const updateApplicationDraft = async (applicationId, newData) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ id: applicationId, ...newData });
		}, 1000);
	});
};

/**
 * // TODO: this is just a mock.
 *
 * @param {any} payload
 * @returns {Promise<any>}
 */
export const createApplicationDraft = (payload) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ ...payload, id: 123 });
		}, 1000);
	});
};

/**
 * // TODO: this is just a mock.
 *
 * @param {string} id
 * @param {string} sectorName
 * @returns {Promise<any>}
 */
export const getApplicationDraft = (id, sectorName = '') => {
	const mockedResponse =
		id === '123' ? { id: 123, sector: { name: sectorName } } : fixtureApplications[0];

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockedResponse);
		}, 1000);
	});
};
