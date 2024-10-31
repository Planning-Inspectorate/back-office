import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { getServiceUserUnder18AndCountyValue } from '../utils.js';

/**
 * Migrate service-users for a case
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrateServiceUsers = async (log, caseReference) => {
	try {
		log.info(`reading Service Users with caseReference ${caseReference}`);

		const { serviceUsers, count } = await getServiceUsers(log, caseReference);

		log.info(`found ${count} Service Users: ${JSON.stringify(serviceUsers.map((u) => u.id))}`);

		if (serviceUsers.length > 0) {
			const mappedServiceUsers = serviceUsers.map((serviceUser) => ({
				...serviceUser,
				...getServiceUserUnder18AndCountyValue(serviceUser.addressCounty),
				sourceSuid: serviceUser.sourceSuid ?? '',
				caseReference
			}));
			await makePostRequest(log, '/migration/service-user', mappedServiceUsers);
		}
	} catch (e) {
		throw new Error(`Failed to migrate Service User for case ${caseReference}`, { cause: e });
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const getServiceUsers = async (log, caseReference) => {
	log.info(`Getting Service Users for case ${caseReference}`);
	const [serviceUsers, count] = await SynapseDB.query(
		'SELECT * FROM [odw_curated_migration_db].[dbo].[service_user] WHERE caseReference = ?;',
		{
			replacements: [caseReference]
		}
	);
	return { serviceUsers, count };
};
