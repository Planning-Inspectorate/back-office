import { SynapseDB } from '../../common/synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequest } from '../../common/back-office-api-client.js';

/**
/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string[]} caseReferences
 */
export const migrationNsipDocuments = async (log, caseReferences) => {
	for (const caseReference of caseReferences) {
		try {
			log.info(`Migrating NSIP Documents for case ${caseReference}`);

			const projects = await getNsipDocuments(log, caseReference);

			if (projects.length > 0) {
				log.info(`Migrating ${projects.length} NSIP Documents for case ${caseReference}`);

				await makePostRequest(log, '/migration/nsip-document', projects);

				log.info('Successfully migrated NSIP Document');
			} else {
				log.warn(`No NSIP Document found for case ${caseReference}`);
			}
		} catch (e) {
			log.error(`Failed to migrate NSIP Document for case ${caseReference}`, e);
			throw e;
		}
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
const getNsipDocuments = async (log, caseReference) => {
	const documents = await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[document_meta_data] WHERE caseRef = ?;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);

	log.info(`Retrieved documents ${JSON.stringify(documents)}`);

	return documents;
};
