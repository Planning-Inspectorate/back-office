import { databaseConnector } from '../utils/database-connector.js';

export const getAll = () => {
	return databaseConnector.zoomLevel.findMany();
};

/**
 *
 * @param {string} name
 * @returns {Promise<import('@pins/appeals.api').Schema.ZoomLevel | null>}
 */
export const getByName = (name) => {
	return databaseConnector.zoomLevel.findUnique({ where: { name } });
};
