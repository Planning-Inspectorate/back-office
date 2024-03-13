import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { removeNullValues } from '../utils.js';

const serviceUserQuery =
	'SELECT * FROM [odw_curated_db].[dbo].[nsip_service_user] WHERE caseReference = ?';

/**
 * Migrate service-users
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateServiceUsers = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		await migrateServiceUsersForCase(logger, caseReference);
	}
};

/**
 * Migrate service-users for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export async function migrateServiceUsersForCase(log, caseReference) {
	try {
		log.info(`reading Service Users with caseReference ${caseReference}`);

		const [serviceUsers, count] = await SynapseDB.query(serviceUserQuery, {
			replacements: [caseReference]
		});

		serviceUsers.map(removeNullValues);

		log.info(`found ${count} Service Users: ${JSON.stringify(serviceUsers.map((u) => u.id))}`);

		if (serviceUsers.length > 0) {
			await makePostRequest(log, '/migration/service-user', serviceUsers);
		}
	} catch (e) {
		log.error(`Failed to migrate Service User for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
}
