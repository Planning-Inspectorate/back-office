import { pick } from 'lodash-es';
import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@prisma/client').Prisma.DocumentActivityLogUncheckedCreateInput} documentLog
 * @returns {Promise<import('@pins/applications.api').Schema.DocumentActivityLog>}
 */
export const create = (documentLog) => {
	return databaseConnector.documentActivityLog.create({
		data: {
			...pick(documentLog, ['user', 'status']),
			DocumentVersion: {
				connect: {
					documentGuid_version: {
						documentGuid: documentLog.documentGuid,
						version: documentLog.version
					}
				}
			}
		}
	});
};
