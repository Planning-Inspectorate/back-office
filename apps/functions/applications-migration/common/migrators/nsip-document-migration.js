import { SynapseDB } from '../synapse-db.js';
import { QueryTypes } from 'sequelize';
import { makePostRequestStreamResponse } from '../back-office-api-client.js';

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 */
export const migrationNsipDocumentsByReference = async (log, caseReference) => {
	console.log(`Fetching NSIP Documents for case ${caseReference} from ODW`);
	const documents = [
		{
			documentId: '15122335',
			caseId: 100002560,
			caseRef: 'BC0110039',
			documentReference: 'BC0110039-000053',
			version: 1,
			examinationRefNo: null,
			filename: 'test',
			originalFilename: 'test',
			size: 110155,
			mime: 'pdf',
			documentURI: 'https://test.uri.',
			publishedDocumentURI: null,
			path: 'test/path',
			virusCheckStatus: 'scanned',
			fileMD5: 'a1e7f707c045e76240effa1ff45e7252',
			dateCreated: '2016-04-06 19:12:39.0000000',
			lastModified: '2016-04-06 19:12:39.0000000',
			caseType: 'nsip',
			redactedStatus: null,
			publishedStatus: 'published',
			datePublished: '2015-02-11 00:00:00.0000000',
			documentType: 'Environmental Impact Assessment',
			securityClassification: null,
			sourceSystem: 'horizon',
			origin: null,
			owner: 'horizontest\\\\admin',
			author: null,
			authorWelsh: null,
			representative: null,
			description: null,
			descriptionWelsh: null,
			documentCaseStage: 'pre-application',
			filter1: 'Environmental Impact Assessment',
			filter1Welsh: null,
			filter2: null,
			horizonFolderId: '15120278',
			transcriptId: null
		}
	];

	if (!documents.length) {
		log.warn(`No NSIP Document found for case ${caseReference}`);
		return null;
	}

	console.log(`Migrating ${documents.length} NSIP Documents for case ${caseReference}`);
	return makePostRequestStreamResponse(log, '/migration/nsip-document', documents);
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
