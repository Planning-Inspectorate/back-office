import { databaseConnector } from '../utils/database-connector.js';

export const getAll = () => {
	return databaseConnector.region.findMany();
};

/**
 *
 * @param {string} name
 * @returns {Promise<import('@pins/api').Schema.Region | null>}
 */
export const getByName = (name) => {
	return databaseConnector.region.findUnique({ where: { name } });
};
