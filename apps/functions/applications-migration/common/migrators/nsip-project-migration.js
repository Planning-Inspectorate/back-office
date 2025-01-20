import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequestStreamResponse } from '../back-office-api-client.js';
import { valueToArray } from '../utils.js';
import { migrateFoldersForCase } from './folder-migration.js';
import { Readable } from 'stream';

/**
 * Migrate an nsip-project by case reference
 *
 * @param {import('@azure/functions').InvocationContext} log
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

			const projectStream = makePostRequestStreamResponse(log, '/migration/nsip-project', projects);
			const responseStream = Readable.from(
				(async function* () {
					if (overrideMigrationStatus) {
						yield `Running project-migration to publish and mark as migrated...`;
					}
					for await (const chunk of projectStream) {
						yield chunk;
					}
					log.info(`Migrating folders for case ${caseReference}`);
					if (!overrideMigrationStatus) {
						await migrateFoldersForCase(log, caseReference);
						log.info(`Successfully migrated folders for case ${caseReference}`);
						yield `Successfully migrated folders for case ${caseReference}\n`;
					}
				})()
			);

			log.info(`Successfully migrated NSIP Project ${caseReference}`);
			return responseStream;
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
 * @param {import('@azure/functions').InvocationContext} log
 * @param {string} caseReference
 * @param {boolean} overrideMigrationStatus
 */
export const getNsipProjects = async (log, caseReference, overrideMigrationStatus) => {
	const projects = await SynapseDB.query(
		// 'SELECT * FROM [odw_curated_migration_db].[dbo].[nsip_project] WHERE caseReference = ?',
		'SELECT * FROM [odw_curated_db].[dbo].[nsip_project] WHERE caseReference = ?',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);

	return projects.map((project) => ({
		...project,
		nsipOfficerIds: valueToArray(project.nsipOfficerIds),
		nsipAdministrationOfficerIds: valueToArray(project.nsipAdministrationOfficerIds),
		inspectorIds: valueToArray(project.inspectorIds),
		migrationStatus: overrideMigrationStatus ? true : Boolean(project.migrationStatus),
		regions: valueToArray(project.regions),
		projectType: project.projectType,
		publishStatus: mapPublishStatus(project.publishStatus)
	}));
};

const mapPublishStatus = (status) => {
	switch (status) {
		case 'depublished':
		case 'do not publish':
			return 'unpublished';
		case 'not published':
			return null;
		default:
			return status;
	}
};
