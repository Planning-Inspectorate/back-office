import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequest } from '../back-office-api-client.js';

/**
 * Migrate multiple nsip-projects
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 * @param {boolean} skipValidation
 */
export const migrateNsipProjects = async (log, caseReferences, skipValidation = false) => {
	log.info(`Migrating ${caseReferences.length} Cases`);

	for (const caseReference of caseReferences) {
		await migrateNsipProjectByReference(log, caseReference, false, skipValidation);
	}
};

/**
 * Migrate an nsip-project by case reference
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} overrideMigrationStatus
 * @param {boolean} skipValidation
 */
export async function migrateNsipProjectByReference(
	log,
	caseReference,
	overrideMigrationStatus,
	skipValidation = false
) {
	try {
		log.info(`Migrating NSIP Project for case ${caseReference}`);

		const projects = await getNsipProjects(log, caseReference, overrideMigrationStatus);

		if (projects.length > 0) {
			log.info(`Migrating ${projects.length} NSIP Projects for case ${caseReference}`);

			await makePostRequest(log, '/migration/nsip-project', { data: projects, skipValidation });

			log.info('Successfully migrated NSIP Project');
		} else {
			log.warn(`No NSIP Project found for case ${caseReference}`);
		}
	} catch (e) {
		log.error(`Failed to migrate NSIP Project for case ${caseReference}`, e?.response?.body, e);
		throw e;
	}
}

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} overrideMigrationStatus
 */
export const getNsipProjects = async (log, caseReference, overrideMigrationStatus) => {
	const projects = await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[nsip_data] WHERE caseReference = ? AND sourceSystem = ?;',
		{
			replacements: [caseReference, 'horizon'],
			type: QueryTypes.SELECT
		}
	);

	log.info(`Retrieved projects ${JSON.stringify(projects)}`);

	return projects.map((project) => ({
		...project,
		nsipOfficerIds: valueToArray(project.nsipOfficerIds),
		nsipAdministrationOfficerIds: valueToArray(project.nsipAdministrationOfficerIds),
		inspectorIds: valueToArray(project.inspectorIds),
		migrationStatus: overrideMigrationStatus ? true : Boolean(project.migrationStatus),
		regions: valueToArray(project.region),
		projectType: mapProjectType(project.projectType)
	}));
};

const valueToArray = (value) => (value ? [value] : []);

/**
 * temporary workaround to fix casing issue
 * TODO: remove once ODW-1184 resolved
 */
const mapProjectType = (projectType) =>
	({ 'WW01 - Waste Water treatment Plants': 'WW01 - Waste Water Treatment Plants' }[projectType] ||
	projectType);
