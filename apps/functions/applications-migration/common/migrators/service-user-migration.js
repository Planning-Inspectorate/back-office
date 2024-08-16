import { SynapseDB } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { getNsipProjects } from './nsip-project-migration.js';

/**
 * Migrate service-users
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string} caseReference
 */
export const migrateServiceUsers = async (logger, caseReference) => {
	// get project data to retrieve caseId (which is called caseReference in ODW database)
	const projects = await getNsipProjects(logger, caseReference, false);
	if (!projects[0]) {
		logger.warn(`No NSIP Project found for case ${caseReference}`);
	} else {
		await migrateServiceUsersForCase(logger, caseReference, projects[0].caseId.toString());
	}
};

/**
 * Migrate service-users for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {string} caseId
 */
export const migrateServiceUsersForCase = async (log, caseReference, caseId) => {
	try {
		log.info(`reading Service Users with caseReference ${caseReference} (caseId ${caseId})`);

		const { serviceUsers, count } = await getServiceUsers(log, caseId);

		log.info(`found ${count} Service Users: ${JSON.stringify(serviceUsers.map((u) => u.id))}`);

		if (serviceUsers.length > 0) {
			const mappedServiceUsers = serviceUsers.map((serviceUser) => ({
				...serviceUser,
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
 * @param {string} caseId
 *
 *
 */
export const getServiceUsers = async (log, caseId) => {
	// the field is called caseReference in the ODW DB but uses  caseId
	const [serviceUsers, count] = await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[nsip_service_user] WHERE caseReference = ? AND sourceSystem = ?;',
		{
			replacements: [caseId, 'Horizon']
		}
	);
	return { serviceUsers, count };
};
