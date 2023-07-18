import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@pins/api').Schema.DocumentActivityLog[]} documentLogs
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const createMany = (documentLogs) => {
	return databaseConnector.documentActivityLog.createMany({ data: documentLogs });
};

/**
 *
 * @param {import('@pins/applications.api').Schema.DocumentActivityLog} documentLog
 * @returns {Promise<import('@pins/applications.api').Schema.DocumentActivityLog>}
 */
export const create = (documentLog) => {
	return databaseConnector.documentActivityLog.create({ data: documentLog });
};
