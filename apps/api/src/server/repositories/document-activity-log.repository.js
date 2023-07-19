import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.DocumentActivityLog} documentLog
 * @returns {Promise<import('@pins/applications.api').Schema.DocumentActivityLog>}
 */
export const create = (documentLog) => {
	return databaseConnector.documentActivityLog.create({ data: documentLog });
};
