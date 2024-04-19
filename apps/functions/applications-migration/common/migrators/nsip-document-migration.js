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

			const documents = await getNsipDocuments(log, caseReference);

			if (documents.length > 0) {
				log.info(`Migrating ${documents.length} NSIP Documents for case ${caseReference}`);

				await makePostRequest(log, '/migration/nsip-document', documents);

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
	return await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[document_meta_data] WHERE caseRef = ?;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);
};
