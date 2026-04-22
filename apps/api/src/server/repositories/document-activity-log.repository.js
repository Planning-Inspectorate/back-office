import { pick } from 'lodash-es';
import { databaseConnector } from '#utils/database-connector.js';

/**
 *
 * @param {import('#database-client').Prisma.DocumentActivityLogUncheckedCreateInput} documentLog
 * @param {import('#database-client').Prisma.TransactionClient} [tx] - Optional transaction client
 * @returns {Promise<import('#database-client').DocumentActivityLog>}
 */
export const create = (documentLog, tx = databaseConnector) => {
	return tx.documentActivityLog.create({
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
