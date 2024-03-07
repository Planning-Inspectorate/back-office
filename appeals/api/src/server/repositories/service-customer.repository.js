import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/appeals.api').Schema.ServiceUser | null>}
 */
export const getById = (id) => {
	return databaseConnector.serviceUser.findUnique({ where: { id } });
};
