import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.ServiceCustomer | null>}
 */
export const getById = (id) => {
	return databaseConnector.serviceCustomer.findUnique({ where: { id } });
};
