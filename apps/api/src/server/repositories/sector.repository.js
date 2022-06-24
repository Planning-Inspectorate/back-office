import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @returns {Promise<import('@pins/api').Schema.Sector[]>}
 */
export const getAll = () => {
	return databaseConnector.sector.findMany();
};
