import { SynapseDB } from '../../common/synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequest } from '../../common/back-office-api-client.js';
import { removeNullValues } from '../../common/utils.js';

/**
 * Migrate multiple nsip-projects
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 */
export const migrateNsipProjects = async (log, caseReferences) => {
	log.info(`Migrating ${caseReferences.length} Cases`);

	for (const caseReference of caseReferences) {
		await migrateNsipProjectByReference(log, caseReference);
	}
};

/**
 * Migrate an nsip-project by case reference
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export async function migrateNsipProjectByReference(log, caseReference) {
	try {
		log.info(`Migrating NSIP Project for case ${caseReference}`);

		const projects = await getNsipProjects(log, caseReference);

		if (projects.length > 0) {
			log.info(`Migrating ${projects.length} NSIP Projects for case ${caseReference}`);

			await makePostRequest(log, '/migration/nsip-project', projects);

			log.info('Successfully migrated NSIP Project');
		} else {
			log.warn(`No NSIP Project found for case ${caseReference}`);
		}
	} catch (e) {
		log.error(`Failed to migrate NSIP Project for case ${caseReference}`, e);
		throw e;
	}
}

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
const getNsipProjects = async (log, caseReference) => {
	const projects = await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[nsip_data] WHERE caseReference = ?;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);

	log.info(`Retrieved projects ${JSON.stringify(projects)}`);

	projects.forEach((project) => {
		// @ts-ignore
		project.regions = [project.region];
		removeNullValues(project);
	});

	return projects;
};
