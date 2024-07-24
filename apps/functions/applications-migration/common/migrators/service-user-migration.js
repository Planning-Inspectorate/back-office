import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';

const serviceUserQuery =
	'SELECT * FROM [odw_curated_db].[dbo].[nsip_service_user] WHERE caseReference = ?';

/**
 * Migrate service-users
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 * @param {boolean} skipValidation
 */
export const migrateServiceUsers = async (logger, caseReferences, skipValidation = false) => {
	for (const caseReference of caseReferences) {
		await migrateServiceUsersForCase(logger, caseReference, skipValidation);
	}
};

/**
 * Migrate service-users for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} skipValidation
 */
export async function migrateServiceUsersForCase(log, caseReference, skipValidation = false) {
	try {
		log.info(`reading Service Users with caseReference ${caseReference}`);

		const { serviceUsers, count } = await getServiceUsers(log, caseReference);

		log.info(`found ${count} Service Users: ${JSON.stringify(serviceUsers.map((u) => u.id))}`);

		if (serviceUsers.length > 0) {
			await makePostRequest(log, '/migration/service-user', { data: serviceUsers, skipValidation });
		}
	} catch (e) {
		log.error(`Failed to migrate Service User for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
}

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 *
 */
export const getServiceUsers = async (log, caseReference) => {
	const [serviceUsers, count] = await SynapseDB.query(serviceUserQuery, {
		replacements: [caseReference]
	});
	return { serviceUsers, count };
};
