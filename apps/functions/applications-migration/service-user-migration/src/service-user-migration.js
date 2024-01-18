import { SynapseDB } from '../../common/synapse-db.js';
import { makePostRequest } from '../../common/back-office-api-client.js';

const serviceUserQuery = `
	SELECT *
	FROM [odw_curated_db].[dbo].[nsip_service_user]
	WHERE caseReference = ?
`;

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 */
export const migrateServiceUsers = async (log, caseReferences) => {
	for (const caseReference of caseReferences) {
		log.info(`reading Service Users with caseReference ${caseReference}`);

		const [serviceUsers, count] = await SynapseDB.query(serviceUserQuery, {
			replacements: [caseReference]
		});

		log.info(`found ${count} Service Users: ${JSON.stringify(serviceUsers.map((u) => u.id))}`);

		if (serviceUsers.length > 0) {
			await makePostRequest(log, '/migration/service-user', serviceUsers);
		}
	}
};
