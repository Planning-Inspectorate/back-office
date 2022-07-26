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
 * @param {string?} sectorName
 * @returns {Promise<Sector[]>}
 */
export const getSubSectorsBySectorName = (sectorName) => {
	return get(`applications/sector?sectorName=${sectorName||''}`);
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
