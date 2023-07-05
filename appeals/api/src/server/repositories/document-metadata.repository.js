import { databaseConnector } from '../utils/database-connector.js';
import {
	mapDocumentNameForStorageUrl,
	mapBlobPath
} from '../endpoints/documents/documents.mapper.js';

/** @typedef {import('apps/api/src/database/schema.js').Document} Document */
/** @typedef {import('apps/api/src/database/schema.js').DocumentVersion} DocumentVersion */

/**
 * @param {any} metadata
 * @param {any} context
 * @returns {import('./appeal.repository.js').PrismaPromise<DocumentVersion>}
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
 * @returns {import('./appeal.repository.js').PrismaPromise<DocumentVersion>}
 */
export const addDocumentVersion = async ({ documentGuid, ...metadata }) => {
	// @ts-ignore
	const transaction = await databaseConnector.$transaction(async (tx) => {
		const document = await tx.document.findFirst({
			include: { case: true },
			where: { guid: documentGuid }
		});

		const { reference } = document.case;
		const { name, latestVersionId } = document;

		const newVersionId = latestVersionId + 1;

		metadata.fileName = name;
		metadata.blobStoragePath = mapBlobPath(documentGuid, reference, name, newVersionId);

		const documentVersion = await tx.documentVersion.upsert({
			create: { ...metadata, version: newVersionId, Document: { connect: { guid: documentGuid } } },
			where: { documentGuid_version: { documentGuid, version: newVersionId } },
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
			where: { guid: documentGuid }
		});

		return documentVersion;
	});

	return transaction;
};
