import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @typedef {{documentGuid: string, version: number, user: string, status: string}} CreateLogInput
 * @param {CreateLogInput} documentLog
 * @returns {Promise<import('@pins/applications.api').Schema.DocumentActivityLog>}
 */
export const create = (documentLog) => {
	return databaseConnector.documentActivityLog.create({ data: documentLog });
};
