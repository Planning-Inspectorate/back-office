import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import logger from '../../utils/logger.js';
import { mapDocumentsForDatabase, mapDocumentsForBlobStorage } from './documents.mapper.js';
import { upsertCaseFolders } from '../../repositories/folder.repository.js';
import { getDocumentsByAppealId, getDocumentById } from '../../repositories/document.repository.js';
import {
	addDocument,
	addDocumentVersion
} from '../../repositories/document-metadata.repository.js';

/** @typedef {import("../appeals.js").RepositoryGetByIdResultItem} RepositoryResult */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.Document} DocumentVersion */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.FolderTemplate} FolderTemplate */
/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentApiRequest} DocumentApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentVersionApiRequest} DocumentVersionApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentMetadata} DocumentMetadata */

/**
 * Returns a single document through its GUID
 * @param {string} documentId
 * @returns {Promise<Document>}
 */
export const getDocumentForAppeal = async (documentId) => {
	const document = await getDocumentById(documentId);
	return document;
};

/**
 * Returns all documents for the current Appeal, or filtered by section name
 * @param {RepositoryResult} appeal
 * @param {('appellantCase'|'lpaQuestionnaire'|null)} sectionName
 * @returns {Promise<Folder[]>}
 */
export const getDocumentsForAppeal = async (appeal, sectionName = null) => {
	const folderLayout = await upsertCaseFolders(appeal.id);
	const documents = await getDocumentsByAppealId(appeal.id);

	for (const folder of folderLayout) {
		// @ts-ignore
		folder.documents = documents.filter((d) => d.folderId === folder.id);
	}

	if (sectionName) {
		return folderLayout.filter((f) => f.path.indexOf(sectionName) >= 0);
	}

	return folderLayout;
};

/**
 * Adds multiple documents (and their version) for an Appeal
 * @param {DocumentApiRequest} upload
 * @param {RepositoryResult} appeal
 * @returns {Promise<{documents: BlobInfo[]}>}}
 */
export const addDocumentsToAppeal = async (upload, appeal) => {
	if (!appeal || appeal.reference == null) {
		throw new Error('Case not found or has no reference');
	}
	const { blobStorageContainer, documents } = upload;
	const documentsToSendToDatabase = mapDocumentsForDatabase(
		appeal.id,
		blobStorageContainer,
		documents
	);
	const documentsCreated = await addDocumentAndVersion(
		appeal.id,
		appeal.reference,
		documentsToSendToDatabase
	);

	return {
		documents: mapDocumentsForBlobStorage(documentsCreated, appeal.reference)
	};
};

/**
 *
 * @param {number} caseId
 * @param {string} reference
 * @param {DocumentMetadata[]} documents
 * @returns {import('../../repositories/appeal.repository.js').PrismaPromise<DocumentVersion[]>}
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
					folderId: Number(d.folderId)
				}
			);

			logger.info(`Upserted document with guid: ${document.guid}`);

			return document;
		});

	logger.info(`Upserted ${results.length} documents to database`);

	return results;
};

/**
 * @param {DocumentVersionApiRequest} upload
 * @param {RepositoryResult} appeal
 * @param {string} documentId
 * @returns {Promise<{documents: BlobInfo[]}>}}
 */
export const addVersionToDocument = async (upload, appeal, documentId) => {
	if (!appeal || appeal.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	const { blobStorageContainer, document } = upload;
	const documentToSendToDatabase = mapDocumentsForDatabase(appeal.id, blobStorageContainer, [
		document
	])[0];

	const documentVersionCreated = await addDocumentVersion({
		documentGuid: documentId,
		fileName: '',
		originalFilename: documentToSendToDatabase.name,
		mime: documentToSendToDatabase.documentType,
		size: documentToSendToDatabase.documentSize,
		version: 1,
		blobStoragePath: '',
		blobStorageContainer: documentToSendToDatabase.blobStorageContainer
	});

	return {
		documents: mapDocumentsForBlobStorage(
			[documentVersionCreated],
			appeal.reference,
			documentVersionCreated.Document.latestVersionId
		)
	};
};
