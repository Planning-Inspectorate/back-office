import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import logger from '../../utils/logger.js';
import config from '../../config/config.js';
import appealRepository from '../../repositories/appeal.repository.js';
import {
	mapDocumentsToSendToDatabase,
	mapDocumentsToSendToBlobStorage,
	mapDocumentNameForStorageUrl
} from './documents.mapper.js';
import { upsertCaseFolders } from '../../repositories/folder.repository.js';
import { getDocumentsByAppealId, upsertDocument } from '../../repositories/document.repository.js';

/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.FolderTemplate} FolderTemplate */

/**
 * Returns a list of document paths available for the current Appeal
 * @param {number} appealId
 * @param {('appellantCase'|'lpaQuestionnaire'|null)} sectionName
 * @returns {Promise<Folder[]>}
 */
export const getDocumentsForAppeal = async (appealId, sectionName = null) => {
	const appeal = await getAppeal(appealId);
	if (!appeal) {
		return [];
	}

	const folderLayout = await upsertCaseFolders(appealId);
	const documents = await getDocumentsByAppealId(appealId);

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
 * @param {{documentName: string, caseId: number, folderId: number, documentType: string, documentSize: number, fileRowId: string, }[]} documentsToUpload
 * @param {number} appealId
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}}
 */
export const addDocumentsToAppeal = async (documentsToUpload, appealId) => {
	const appeal = await getAppeal(appealId);
	if (!appeal || appeal.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	const documentsToSendToDatabase = mapDocumentsToSendToDatabase(appealId, documentsToUpload);
	const documentsFromDatabase = await upsertDocumentMetadata(appealId, documentsToSendToDatabase);

	const metadataResponse = {
		blobStorageHost: config.blobStorageHost,
		blobStorageContainer: config.blobStorageHost,
		documents: mapDocumentsToSendToBlobStorage(documentsFromDatabase, appeal.reference)
	};
	//await getStorageLocation(requestToDocumentStorage);

	// await upsertDocumentVersionsMetadataToDatabase(
	// 	responseFromDocumentStorage.documents,
	// 	responseFromDocumentStorage.blobStorageContainer
	// );

	return metadataResponse;
};

/**
 * Returns the current appeal by reference
 * @param {number} appealId
 * @returns {Promise<import("../appeals.js").RepositoryGetByIdResultItem|void>}
 */
const getAppeal = async (appealId) => {
	const appeal = await appealRepository.getById(appealId);
	return appeal;
};

/**
 *
 * @param {number} caseId
 * @param {{name: string, folderId: number; documentType: string, documentSize: number}[]} documents
 * @returns {Promise<import('@pins/appeals.api').Schema.Document[]>}
 */
const upsertDocumentMetadata = async (caseId, documents) => {
	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error) => {
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (documentToDB) => {
			const fileName = mapDocumentNameForStorageUrl(documentToDB.name);
			const document = await upsertDocument({
				name: fileName,
				caseId,
				folderId: Number(documentToDB.folderId)
			});

			logger.info(`Upserted document with guid: ${document.guid}`);

			// Call the documentVersionRepository.upsert function to upsert metadata for the document to the database.
			// await documentVerisonRepository.upsert({
			// 	documentGuid: document.guid,
			// 	fileName,
			// 	originalFilename: fileName,
			// 	mime: documentToDB.documentType,
			// 	size: documentToDB.documentSize,
			// 	version: 1
			// });

			// await documentRepository.update(document.guid, {
			// 	latestVersionId: 1
			// });

			// // Log that the metadata for the document has been upserted and its GUID.
			// logger.info(`Upserted metadata for document with guid: ${document.guid}`);

			return document;
		});

	// Log the total number of documents that were upserted to the database.

	//logger.info(`Upserted ${results.length} documents to database`);

	// Return the array of upserted documents.

	return results;
};
