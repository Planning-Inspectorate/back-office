import { DOCUMENT_TYPES } from '../../applications/constants.js';
import { databaseConnector } from '#utils/database-connector.js';
import { getCaseIdFromRef } from './utils.js';
import { pick } from 'lodash-es';
import { publishDocuments } from '../../applications/application/documents/document.service.js';

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('pins-data-model').Schemas.NSIPDocument[]} documents
 */
export const migrateNsipDocuments = async (documents) => {
	console.info(`Migrating ${documents.length} documents`);

	for (const document of documents) {
		const caseId = await getCaseIdFromRef(document.caseRef);

		const documentEntity = {
			guid: document.documentId,
			caseId,
			folderId: Number(document.horizonFolderId),
			documentReference: document.documentReference,
			fromFrontOffice: false,
			documentType: DOCUMENT_TYPES.Document // TODO handle DOCUMENT_TYPES.S51Attachment
		};

		// TODO remove try/catch once ODW fixes missing folder issue (ODW-1117) which causes key constraint error
		try {
			await databaseConnector.document.upsert({
				where: {
					guid: documentEntity.guid
				},
				create: documentEntity,
				update: documentEntity
			});

			const uri = new URL(document.documentURI);
			const privateBlobPath = uri.pathname.match(/^\/document-service-uploads(\/.*)$/)[1];
			const isPublished = document.publishedStatus === 'published';

			const documentVersion = {
				...pick(document, [
					'version',
					'documentType',
					'sourceSystem',
					'origin',
					'originalFilename',
					'representative',
					'description',
					'owner',
					'author',
					'securityClassification',
					'mime',
					'fileMD5',
					'virusCheckStatus',
					'size',
					'filter1',
					'dateCreated',
					'datePublished',
					'examinationRefNo',
					'filter2',
					'publishedStatus',
					'redactedStatus'
				]),
				documentGuid: documentEntity.guid,
				published: isPublished,
				fileName: document.filename,
				horizonDataID: document.documentId.toString(),
				stage: document.documentCaseStage,
				redacted: document.redactedStatus === 'redacted',
				privateBlobContainer: 'document-service-uploads',
				privateBlobPath,
				publishedBlobContainer: isPublished ? 'published-documents' : null,
				publishedBlobPath: isPublished ? 'TODO' : null
			};

			await databaseConnector.documentVersion.upsert({
				where: {
					documentGuid_version: {
						documentGuid: documentVersion.documentGuid,
						version: documentVersion.version
					}
				},
				create: documentVersion,
				update: documentVersion
			});
		} catch (e) {
			console.error(`Error creating document ${documentEntity.guid}`, e);
		}
	}

	const publishableDocumentGuids = documents
		.filter((d) => d.publishedStatus === 'published')
		.map((d) => d.documentId);
	console.log(`Publishing ${publishableDocumentGuids.length} documents`);
	await publishDocuments(publishableDocumentGuids, 'nsip-document-migrator');
};
