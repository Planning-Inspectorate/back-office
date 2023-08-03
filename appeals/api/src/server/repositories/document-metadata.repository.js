import { databaseConnector } from '#utils/database-connector.js';
import { mapBlobPath } from '#endpoints/documents/documents.mapper.js';

/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */
/**
 * @param {any} metadata
 * @param {any} context
 * @returns {Promise<DocumentVersion | null>}
 */
export const addDocument = async (metadata, context) => {
	const transaction = await databaseConnector.$transaction(async (tx) => {
		const document = await tx.document.create({
			data: {
				caseId: context.caseId,
				folderId: context.folderId,
				name: metadata.originalFilename
			}
		});

		const { guid, name } = document;
		const newVersionId = 1;

		metadata.fileName = name;
		metadata.blobStoragePath = mapBlobPath(guid, context.reference, name, newVersionId);
		metadata.documentURI = `${context.blobStorageHost.replace(/\/$/, '')}/${
			metadata.blobStorageContainer
		}/${metadata.blobStoragePath}`;

		const documentVersion = await tx.documentVersion.upsert({
			create: { ...metadata, version: newVersionId, parentDocument: { connect: { guid } } },
			where: { documentGuid_version: { documentGuid: guid, version: newVersionId } },
			update: {}
		});

		await tx.document.update({
			data: { latestVersionId: documentVersion.version },
			where: { guid }
		});

		const latestVersion = await tx.documentVersion.findFirst({
			include: { parentDocument: true },
			where: { documentGuid: guid, version: newVersionId }
		});

		return latestVersion;
	});

	return transaction;
};

/**
 * @param {any} metadata
 * @returns {Promise<DocumentVersion | null>}
 */
export const addDocumentVersion = async ({ context, documentGuid, ...metadata }) => {
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

		const newVersionId = (latestVersionId || 0) + 1;

		metadata.fileName = name;
		metadata.blobStoragePath = mapBlobPath(documentGuid, reference, name, newVersionId);

		metadata.documentURI = `${context.blobStorageHost}/${metadata.blobStorageContainer}/${metadata.blobStoragePath}`;

		await tx.documentVersion.upsert({
			create: {
				...metadata,
				version: newVersionId,
				parentDocument: { connect: { guid: documentGuid } }
			},
			where: { documentGuid_version: { documentGuid, version: newVersionId } },
			update: {}
		});

		await tx.document.update({
			data: { latestVersionId: newVersionId },
			where: { guid: documentGuid }
		});

		const latestVersion = await tx.documentVersion.findFirst({
			include: { parentDocument: true },
			where: { documentGuid, version: newVersionId }
		});

		return latestVersion;
	});

	return transaction;
};
