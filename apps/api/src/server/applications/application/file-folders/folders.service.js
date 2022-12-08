import * as documentRepository from '../../../repositories/document.repository.js';
import * as folderRepository from '../../../repositories/folder.repository.js';
import { getPageCount, getSkipValue } from '../../../utils/database-pagination.js';
import { mapDocumentDetails } from '../../../utils/mapping/map-document-details.js';
import {
	mapBreadcrumbFolderDetails,
	mapFolderDetails,
	mapSingleFolderDetails
} from '../../../utils/mapping/map-folder-details.js';

/**
 * @typedef {import('@pins/applications').FolderDetails} FolderDetails
 * @typedef {import('apps/api/prisma/schema.js').Document} Document
 * @typedef {{ guid: string, documentName: string, status: string }} DocumentDetails
 * @typedef {{ page: number, pageSize: number, pageCount: number, itemCount: number, items: DocumentDetails[]}} PaginatedDocumentDetails
 */

/**
 * Returns all the folders on a case
 *
 * @param {number} id
 * @param {number |null} folderId
 * @returns {Promise<FolderDetails[]>}
 */
export const getFolders = async (id, folderId) => {
	const allFolders = await folderRepository.getByCaseId(id, folderId);

	return mapFolderDetails(allFolders);
};

/**
 * Returns a single folder on a case
 *
 * @param {number} folderId
 * @returns {Promise<FolderDetails |null>}
 */
export const getFolder = async (folderId) => {
	const folder = await folderRepository.getById(folderId);

	return folder ? mapSingleFolderDetails(folder) : null;
};

/**
 * Returns parent folder path as an ordered array for a folder on a case
 *
 * @param {number} id
 * @param {number} folderId
 * @returns {Promise<FolderDetails[] |null>}
 */
export const getFolderPath = async (id, folderId) => {
	const folders = await folderRepository.getFolderPath(id, folderId);

	return mapBreadcrumbFolderDetails(folders);
};

/**
 * Returns paginated array of documents in a folder on a case
 *
 * @param {number} folderId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<PaginatedDocumentDetails>}
 */
export const getDocumentsInFolder = async (folderId, pageNumber = 1, pageSize = 50) => {
	const skipValue = getSkipValue(pageNumber, pageSize);
	const documentsCount = await documentRepository.getDocumentsCountInFolder(folderId);
	const documents = await documentRepository.getDocumentsInFolder(folderId, skipValue, pageSize);

	return {
		page: pageNumber,
		pageSize: documents.length,
		pageCount: getPageCount(documentsCount, pageSize),
		itemCount: documentsCount,
		items: mapDocumentDetails(documents)
	};
};
