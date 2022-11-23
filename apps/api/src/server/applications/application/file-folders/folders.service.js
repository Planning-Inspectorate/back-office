import * as documentRepository from '../../../repositories/document.repository.js';
import * as folderRepository from '../../../repositories/folder.repository.js';
import {
	mapBreadcrumbFolderDetails,
	mapFolderDetails,
	mapSingleFolderDetails
} from '../../../utils/mapping/map-folder-details.js';

/** @typedef {import('@pins/applications').FolderDetails} FolderDetails */
/** @typedef {import('apps/api/prisma/schema.js').Document} Document */

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
 * @returns {Promise<FolderDetails[]>}
 */
export const getFolderPath = async (id, folderId) => {
	const folders = await folderRepository.getFolderPath(id, folderId);

	return mapBreadcrumbFolderDetails(folders);
};

/**
 * Returns all documents in a folder on a case
 *
 * @param {number} folderId
 * @returns {Promise<Document[]>}
 */
export const getDocumentsInFolder = async (folderId) => {
	const documents = documentRepository.getDocumentsInFolder(folderId);

	return documents;
};
