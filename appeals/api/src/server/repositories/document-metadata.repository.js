import { databaseConnector } from '#utils/database-connector.js';
import documentRedactionStatusRepository from '#repositories/document-redaction-status.repository.js';
import { findPreviousVersion } from '#utils/find-previous-version.js';
import { mapBlobPath } from '#endpoints/documents/documents.mapper.js';
import { randomUUID } from 'node:crypto';

/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */
/** @typedef {import('@pins/appeals.api').Schema.DocumentRedactionStatus} RedactionStatus */

/**
 * @returns {Promise<RedactionStatus | undefined>}
 */
const getDefaultRedactionStatus = async () => {
	const redactionStatuses =
		await documentRedactionStatusRepository.getAllDocumentRedactionStatuses();
	const defaultRedactionStatus = 'Unredacted';
	const unredactedStatus = redactionStatuses.find(
		(redactionStatus) => redactionStatus.name === defaultRedactionStatus
	);
	return unredactedStatus;
};

/**
 * @param {any} metadata
 * @param {any} context
 * @returns {Promise<DocumentVersion | null>}
 */
export const addDocument = async (metadata, context) => {
	const unredactedStatus = await getDefaultRedactionStatus();
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
			create: {
				...metadata,
				version: newVersionId,
				parentDocument: {
					connect: {
						guid
					}
				},
				dateReceived: new Date().toISOString(),
				redactionStatus: {
					connect: {
						id: unredactedStatus?.id
					}
				},
				published: false,
				draft: true
			},
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
	const unredactedStatus = await getDefaultRedactionStatus();
	const transaction = await databaseConnector.$transaction(async (tx) => {
		const document = await tx.document.findFirst({
			include: {
				case: true,
				documentVersion: true
			}
		});

		if (document == null || document.isDeleted) {
			throw new Error('Document not found');
		}

		const { reference } = document.case;
		const { name, documentVersion } = document;

		const newVersionId = documentVersion ? documentVersion.length + 1 : 1;

		metadata.fileName = name;
		metadata.blobStoragePath = mapBlobPath(documentGuid, reference, name, newVersionId);
		metadata.documentURI = `${context.blobStorageHost}/${metadata.blobStorageContainer}/${metadata.blobStoragePath}`;

		await tx.documentVersion.upsert({
			create: {
				...metadata,
				version: newVersionId,
				parentDocument: {
					connect: {
						guid: documentGuid
					}
				},
				dateReceived: new Date().toISOString(),
				redactionStatus: {
					connect: {
						id: unredactedStatus?.id
					}
				},
				published: false,
				draft: true
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

/**
 * @param {string} documentGuid
 * @param {number} version
 */
export const deleteDocumentVersion = async (documentGuid, version) => {
	const transaction = await databaseConnector.$transaction(async (tx) => {
		const document = await tx.document.findFirst({
			include: {
				documentVersion: true,
				latestDocumentVersion: true
			},
			where: { guid: documentGuid }
		});

		if (document && document.latestDocumentVersion && document.documentVersion) {
			const versionToDelete = document.documentVersion.find((v) => v.version === version);
			const versionCount = document.documentVersion.filter((v) => !v.isDeleted).length;

			if (versionToDelete) {
				if (versionToDelete.version !== document.latestDocumentVersion.version) {
					await deleteVersion(tx, document.guid, versionToDelete.version);
				} else {
					if (versionCount === 1) {
						await deleteVersion(tx, document.guid, versionToDelete.version);
						await deleteDocument(tx, document.guid, document.name);
					} else {
						await setPreviousVersion(tx, document, versionToDelete.version);
						await deleteVersion(tx, document.guid, versionToDelete.version);
					}
				}

				return {
					...document,
					isDeleted: versionCount === 1,
					latestDocumentVersion: null,
					latestVersionId: null,
					documentVersion: []
				};
			}
		}
	});

	return transaction;
};

/**
 * @param {string} documentGuid
 * @param {number} version
 * @param {string} action
 * @param {number} auditTrailId
 */
export const addDocumentVersionAudit = async (documentGuid, version, action, auditTrailId) => {
	await databaseConnector.documentVersionAudit.create({
		data: {
			documentGuid,
			version,
			action,
			auditTrailId
		}
	});
};

/**
 * @param {any} tx
 * @param {string} documentGuid
 * @param {number} version
 */
const deleteVersion = async (tx, documentGuid, version) => {
	await tx.documentVersion.update({
		where: { documentGuid_version: { documentGuid, version } },
		data: { isDeleted: true }
	});
};

/**
 * @param {any} tx
 * @param {string} documentGuid
 * @param {string} name
 */
const deleteDocument = async (tx, documentGuid, name) => {
	await tx.document.update({
		where: { guid: documentGuid },
		data: {
			isDeleted: true,
			name: `_${randomUUID()}_${name}`
		}
	});
};

/**
 * @param {any} tx
 * @param {Document} document
 * @param {number} version
 */
const setPreviousVersion = async (tx, document, version) => {
	const versions = document.documentVersion?.filter((v) => !v.isDeleted).map((v) => v.version);

	if (!versions) {
		return;
	}
	const previousVersion = findPreviousVersion(versions, version);
	if (previousVersion) {
		await tx.document.update({
			where: { guid: document.guid },
			data: { latestVersionId: previousVersion }
		});
	}
};
