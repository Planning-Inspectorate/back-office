import { executeOdwQuery } from '../synapse-db.js';
import { makePostRequest } from '../back-office-api-client.js';
import { valueToArray } from '../utils.js';
import { migrateFoldersForCase } from './folder-migration.js';

/**
 * Migrate an nsip-project by case reference
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} overrideMigrationStatus
 */
export const migrateNsipProjectByReference = async (
	log,
	caseReference,
	overrideMigrationStatus = false
) => {
	try {
		log.info(`Fetching NSIP Project for case ${caseReference}`);
		const projects = await getNsipProjects(log, caseReference, overrideMigrationStatus);

		if (projects.length > 0) {
			log.info(`Posting NSIP Project data to API for case ${caseReference}`);
			await makePostRequest(log, '/migration/nsip-project', projects);
			log.info(`Successfully migrated NSIP Project ${caseReference}`);

			log.info(`Migrating folders for case ${caseReference}`);
			await migrateFoldersForCase(log, caseReference);
			log.info(`Successfully migrated folders for case ${caseReference}`);
		} else {
			log.warn(`No NSIP Project found for case ${caseReference}`);
		}
	} catch (e) {
		throw new Error(`Failed to migrate NSIP Project and folders for case ${caseReference}`, {
			cause: e
		});
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} overrideMigrationStatus
 */
export const getNsipProjects = async (log, caseReference, overrideMigrationStatus) => {
	const query =
		'SELECT * FROM [odw_curated_migration_db].[dbo].[nsip_project] WHERE caseReference = ?';
	// const projects = await SynapseDB.query(
	// 	'SELECT * FROM [odw_curated_migration_db].[dbo].[nsip_project] WHERE caseReference = ?',
	// 	{
	// 		replacements: [caseReference],
	// 		type: QueryTypes.SELECT
	// 	}
	// );

	const projects = await executeOdwQuery(query, caseReference);
	console.log('here: ', projects);
	log.info(`Retrieved projects ${JSON.stringify(projects)}`);

	return projects.map((project) => ({
		...project,
		nsipOfficerIds: valueToArray(project.nsipOfficerIds),
		nsipAdministrationOfficerIds: valueToArray(project.nsipAdministrationOfficerIds),
		inspectorIds: valueToArray(project.inspectorIds),
		migrationStatus: overrideMigrationStatus ? true : Boolean(project.migrationStatus),
		regions: valueToArray(project.regions),
		projectType: project.projectType
	}));
};
