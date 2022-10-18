import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.Folder[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.folder.findMany({ where: { caseId } });
};
