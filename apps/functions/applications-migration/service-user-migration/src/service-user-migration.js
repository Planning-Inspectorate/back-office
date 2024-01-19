import { SynapseDB } from '../../common/synapse-db.js';
import { makePostRequest } from '../../common/back-office-api-client.js';
import { removeNullValues } from '../../common/utils.js';

const serviceUserQuery =
	'SELECT * FROM [odw_curated_db].[dbo].[nsip_service_user] WHERE caseReference = ?';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateServiceUsers = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		try {
			logger.info(`reading Service Users with caseReference ${caseReference}`);

			const [serviceUsers, count] = await SynapseDB.query(serviceUserQuery, {
				replacements: [caseReference]
			});

			serviceUsers.map(removeNullValues);

			logger.info(`found ${count} Service Users: ${JSON.stringify(serviceUsers.map((u) => u.id))}`);

			if (serviceUsers.length > 0) {
				await makePostRequest(logger, '/migration/service-user', serviceUsers);
			}
		} catch (e) {
			logger.error(
				`Failed to migrate Service User for case ${caseReference}`,
				e?.response?.body,
				e
			);
			throw e;
		}
	}
};
