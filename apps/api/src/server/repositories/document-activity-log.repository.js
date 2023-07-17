import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@pins/api').Schema.DocumentActivityLog[]} documentLogs
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const createMany = (documentLogs) => {
	return databaseConnector.documentActivityLog.createMany({ data: documentLogs });
};
