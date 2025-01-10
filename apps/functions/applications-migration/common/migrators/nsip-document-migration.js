import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequestStreamResponse } from '../back-office-api-client.js';

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrateNsipDocumentsByReference = async (log, caseReference) => {
	try {
		log.info(`Migrating NSIP Documents for case ${caseReference}`);
		const documents = await getNsipDocuments(log, caseReference);

		if (documents.length > 0) {
			log.info(`Migrating ${documents.length} NSIP Documents for case ${caseReference}`);
			return makePostRequestStreamResponse(log, '/migration/nsip-document', documents);
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
	// Order by documentId, version, dateCreated to ensure we get the versions in order.  dateCreated is added to ensure the original is before any PDF rendition
	// because we are going to make original v1 => v1, rendition v1 => v2, original v2 => v3, rendition v2 => v4 etc.
	const documents = await SynapseDB.query(
		'SELECT * FROM [odw_curated_migration_db].[dbo].[nsip_document] WHERE caseRef = ? ORDER BY documentId, version, dateCreated;',
		{
			replacements: [caseReference],
			type: QueryTypes.SELECT
		}
	);
	if (!documents.length) {
		return [];
	}

	return documents.map((document) => ({
		...document,
		caseId: parseInt(document?.caseId),
		version: parseInt(document?.version),
		size: parseInt(document?.size),
		origin: document?.origin?.trim() === '' ? null : document?.origin,
		securityClassification:
			document?.securityClassification?.trim() === '' ? null : document?.securityClassification
	}));
};
