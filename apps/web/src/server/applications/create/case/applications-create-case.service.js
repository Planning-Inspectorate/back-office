import { fixtureApplications } from '../../../../../testing/applications/fixtures/applications.js';
import { get } from '../../../lib/request.js';

/** @typedef {import('../../applications.types.js').Sector} Sector */
/** @typedef {import('../../applications.types.js').Application} Application */
/** @typedef {import('../../applications.types.js').Region} Region */
/** @typedef {import('../../applications.types').ZoomLevel} ZoomLevel */

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
 * Get all zoom levels
 *
 * @returns {Promise<ZoomLevel[]>}
 */
export const getAllZoomLevels = () => {
	return get(`applications/zoom-level`);
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
	const applicants = [{ id: 2 }];
	const mockedResponse =
		id === '123'
			? { id: 123, sector: { name: sectorName }, ...applicants }
			: fixtureApplications[0];

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mockedResponse);
		}, 1000);
	});
};
