import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequest } from '../back-office-api-client.js';

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrationNsipDocumentsByReference = async (log, caseReference) => {
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
		throw new Error(`Failed to migrate NSIP Document for case ${caseReference}`, { cause: e });
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const getNsipDocuments = async (log, caseReference) => {
	return await SynapseDB.query(
		'SELECT * FROM [odw_curated_db].[dbo].[document_meta_data] WHERE caseRef = ? AND sourceSystem = ?;',
		{
			replacements: [caseReference, 'horizon'],
			type: QueryTypes.SELECT
		}
	);
};
