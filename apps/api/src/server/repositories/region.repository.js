import { databaseConnector } from '../utils/database-connector.js';

export const getAll = () => {
	return databaseConnector.region.findMany();
};

/**
 *
 * @param {string} name
 * @returns {Promise<import('@pins/applications.api').Schema.Region | null>}
 */
export const getByName = (name) => {
	return databaseConnector.region.findUnique({ where: { name } });
};

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.Region | null>}
 */
export const getRegionById = (id) => {
	return databaseConnector.region.findUnique({ where: { id } });
};
