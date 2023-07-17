import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import logger from '#utils/logger.js';
import { mapDocumentsForDatabase, mapDocumentsForBlobStorage } from './documents.mapper.js';
import { getByCaseId, getByCaseIdPath, getById } from '#repositories/folder.repository.js';
import { addDocument, addDocumentVersion } from '#repositories/document-metadata.repository.js';

/** @typedef {import("../appeals.js").RepositoryGetByIdResultItem} RepositoryResult */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.FolderTemplate} FolderTemplate */
/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentApiRequest} DocumentApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentVersionApiRequest} DocumentVersionApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentMetadata} DocumentMetadata */

/**
 * Returns all folder for the current Appeal
 * @param {RepositoryResult} appeal
 * @param {string} folderId
 * @returns {Promise<Folder|null>}
 */
export const getFolderForAppeal = async (appeal, folderId) => {
	//if (!folderId)
	const folder = await getById(Number(folderId));
	if (folder && folder.caseId === appeal.id) {
		return folder;
	}

	return null;
};

/**
 * Returns all folder for the current Appeal
 * @param {RepositoryResult} appeal
 * @param {string?} path
 * @returns {Promise<Folder[]>}
 */
export const getFoldersForAppeal = async (appeal, path = null) => {
	if (path) {
		return await getByCaseIdPath(appeal.id, path);
	}

	return await getByCaseId(appeal.id);
};

/**
 * Adds multiple documents (and their version) for an Appeal
 * @param {DocumentApiRequest} upload
 * @param {RepositoryResult} appeal
 * @returns {Promise<{documents: (BlobInfo|null)[]}>}}
 */
export const addDocumentsToAppeal = async (upload, appeal) => {
	const { blobStorageHost, blobStorageContainer, documents } = upload;
	const documentsToSendToDatabase = mapDocumentsForDatabase(
		appeal.id,
		blobStorageHost,
		blobStorageContainer,
		documents
	);
	const documentsCreated = await addDocumentAndVersion(
		appeal.id,
		appeal.reference,
		documentsToSendToDatabase
	);

	const documentsToAddToBlobStorage = mapDocumentsForBlobStorage(
		documentsCreated,
		appeal.reference
	).filter((d) => d !== null);

	return {
		documents: documentsToAddToBlobStorage
	};
};

/**
 *
 * @param {number} caseId
 * @param {string} reference
 * @param {DocumentMetadata[]} documents
 * @returns {Promise<(DocumentVersion | null)[]>}
 */
const addDocumentAndVersion = async (caseId, reference, documents) => {
	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error) => {
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (d) => {
			const document = await addDocument(
				{
					originalFilename: d.name,
					mime: d.documentType,
					size: d.documentSize,
					version: 1,
					blobStoragePath: '',
					blobStorageContainer: d.blobStorageContainer
				},
				{
					caseId,
					reference,
					folderId: Number(d.folderId),
					blobStorageHost: d.blobStorageHost
				}
			);

			if (!document) {
				logger.error(`Error adding document named: ${d.name}`);
				throw new Error(
					`Error adding document named: ${d.name} in folder ${d.folderId} for appeal ${d.caseId}`
				);
			}
			logger.info(`Added document with guid: ${document.documentGuid}`);

			return document;
		});

	logger.info(`Added ${results.length} documents to database`);

	return results;
};

/**
 * @param {DocumentVersionApiRequest} upload
 * @param {RepositoryResult} appeal
 * @param {Document} document
 * @returns {Promise<{documents: (BlobInfo|null)[]}>}}
 */
export const addVersionToDocument = async (upload, appeal, document) => {
	if (!document) {
		throw new Error('Document not found');
	}

	const { blobStorageHost, blobStorageContainer, document: uploadedDocument } = upload;
	const documentToSendToDatabase = mapDocumentsForDatabase(
		appeal.id,
		blobStorageHost,
		blobStorageContainer,
		[uploadedDocument]
	)[0];

	const documentVersionCreated = await addDocumentVersion({
		context: {
			blobStorageHost: documentToSendToDatabase.blobStorageHost
		},
		documentGuid: document.guid,
		fileName: document.name,
		originalFilename: documentToSendToDatabase.name,
		mime: documentToSendToDatabase.documentType,
		size: documentToSendToDatabase.documentSize,
		version: 1,
		blobStoragePath: '',
		blobStorageContainer: documentToSendToDatabase.blobStorageContainer
	});

	if (!documentVersionCreated) {
		return {
			documents: []
		};
	}
	const documentsToAddToBlobStorage = mapDocumentsForBlobStorage(
		[documentVersionCreated],
		appeal.reference,
		documentVersionCreated.version
	).filter((d) => d !== null);

	return {
		documents: documentsToAddToBlobStorage
	};
};
