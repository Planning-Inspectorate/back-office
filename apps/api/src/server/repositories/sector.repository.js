import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @returns {Promise<import('@pins/api').Schema.Sector[]>}
 */
export const getAll = () => {
	return databaseConnector.sector.findMany();
};

/**
 * @param {string} name
 * @returns {Promise<import('@pins/api').Schema.Sector | null>}
 */
export const getByName = async (name) => {
	return databaseConnector.sector.findUnique({ where: { name } });
};

/**
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.Sector | null>}
 */
export const getSectorById = async (id) => {
	return databaseConnector.sector.findUnique({ where: { id } });
};
