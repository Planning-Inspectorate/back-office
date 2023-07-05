import { databaseConnector } from '../utils/database-connector.js';
import {
	mapDocumentNameForStorageUrl,
	mapBlobPath
} from '../endpoints/documents/documents.mapper.js';

/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */

/**
 * @param {any} metadata
 * @param {any} context
 * @returns {Promise<DocumentVersion | null>}
 */
export const addDocument = async (metadata, context) => {
	// @ts-ignore
	const transaction = await databaseConnector.$transaction(async (tx) => {
		const fileName = mapDocumentNameForStorageUrl(metadata.originalFilename);
		const document = await tx.document.create({
			data: {
				caseId: context.caseId,
				folderId: context.folderId,
				name: fileName
			}
		});

		const { guid, name } = document;
		const newVersionId = 1;

		metadata.fileName = name;
		metadata.blobStoragePath = mapBlobPath(guid, context.reference, name, newVersionId);

		const documentVersion = await tx.documentVersion.upsert({
			create: { ...metadata, version: newVersionId, Document: { connect: { guid } } },
			where: { documentGuid_version: { documentGuid: guid, version: newVersionId } },
			update: {},
			include: {
				Document: {
					include: {
						folder: {}
					}
				}
			}
		});

		await tx.document.update({
			data: { latestVersionId: documentVersion.version },
			where: { guid }
		});

		return documentVersion;
	});

	return transaction;
};

/**
 * @param {any} metadata
 * @returns {Promise<DocumentVersion | null>}
 */
export const addDocumentVersion = async ({ documentGuid, ...metadata }) => {
	// @ts-ignore
	const transaction = await databaseConnector.$transaction(async (tx) => {
		const document = await tx.document.findFirst({
			include: { case: true },
			where: { guid: documentGuid }
		});

		if (document == null) {
			throw new Error('Document not found');
		}

		const { reference } = document.case;
		const { name, latestVersionId } = document;

		// @ts-ignore
		const newVersionId = latestVersionId + 1;

		metadata.fileName = name;
		metadata.blobStoragePath = mapBlobPath(documentGuid, reference, name, newVersionId);

		await tx.documentVersion.upsert({
			create: { ...metadata, version: newVersionId, Document: { connect: { guid: documentGuid } } },
			where: { documentGuid_version: { documentGuid, version: newVersionId } },
			update: {}
		});

		await tx.document.update({
			data: { latestVersionId: newVersionId },
			where: { guid: documentGuid }
		});

		return await tx.documentVersion.findFirst({
			include: { Document: true },
			where: { documentGuid, version: newVersionId }
		});
	});

	return transaction;
};
