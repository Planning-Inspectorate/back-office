import { get } from '../../../lib/request.js';

/** @typedef {import('../../applications.types').Sector} Sector */
/** @typedef {import('../../applications.types').Case} Case */
/** @typedef {import('../../applications.types').Region} Region */
/** @typedef {import('../../applications.types').ZoomLevel} ZoomLevel */
/** @typedef {import('../../applications.types').CaseStage} CaseStage */

/**
 * Get the list of sector for an case
 *
 * @returns {Promise<Sector[]>}
 */
export const getAllSectors = () => {
	return get(`applications/sector`);
};

/**
 * Get all sub-sectors associated with existing sector
 *
 * @param {string=} sectorName
 * @returns {Promise<Sector[]>}
 */
export const getSubSectorsBySectorName = (sectorName) => {
	return get(`applications/sector?sectorName=${sectorName || ''}`);
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
 * Get all possible case stage values
 *
 * @throws {Error}
 * @returns {Promise<CaseStage[] | null>}
 * */
export const getAllCaseStages = async () => {
	const response = await get('applications/case-stage');
	return response ?? null;
};

/**
 * Get all zoom levels
 *
 * @returns {Promise<ZoomLevel[]>}
 */
export const getAllZoomLevels = () => {
	return get(`applications/zoom-level`);
};
