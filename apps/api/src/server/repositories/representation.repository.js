import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.Representation[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.representation.findMany({ where: { caseId } });
};
