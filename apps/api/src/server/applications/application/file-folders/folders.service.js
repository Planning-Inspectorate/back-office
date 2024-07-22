import * as documentRepository from '#repositories/document.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import { getPageCount, getSkipValue } from '#utils/database-pagination.js';
import { mapDocumentVersionDetails } from '#utils/mapping/map-document-details.js';
import {
	mapBreadcrumbFolderDetails,
	mapFolderDetails,
	mapSingleFolderDetails
} from '#utils/mapping/map-folder-details.js';

/**
 * @typedef {import('@pins/applications').FolderDetails} FolderDetails
 * @typedef {import('@pins/applications.api').Schema.Document} Document
 * @typedef {import('@pins/applications.api').Api.DocumentDetails} DocumentDetails
 * @typedef {import('@pins/applications.api').Api.PaginatedDocumentDetails} PaginatedDocumentDetails
 */

/**
 * Returns the root folders on a case, or subfolders if a folder ID is given
 *
 * @param {number} id
 * @param {number |null} folderId
 * @returns {Promise<FolderDetails[]>}
 */
export const getFolders = async (id, folderId) => {
	const folders = await folderRepository.getByCaseId(id, folderId);

	return mapFolderDetails(folders);
};

/**
 * Returns all the folders on a case
 *
 * @param {number} id
 * @returns {Promise<FolderDetails[]>}
 */
export const getAllFolders = async (id) => {
	const allFolders = await folderRepository.getAllByCaseId(id);
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
 * @param {number} caseId
 * @param {string} folderName
 * @param {number} [parentFolderId]
 * @returns {Promise<FolderDetails | null>}
 * */
export const getFolderByName = async (caseId, folderName, parentFolderId) => {
	const folder = await folderRepository.getFolderByNameAndCaseId(
		caseId,
		folderName,
		parentFolderId
	);

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

	// @ts-ignore
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
	const documents = await documentRepository.getDocumentsInFolder(folderId, {
		skip: skipValue,
		take: pageSize
	});

	// @ts-ignore
	const mapDocument = documents.map(({ documentVersion, ...Document }) => ({
		Document,
		...documentVersion[documentVersion.length - 1]
	}));

	return {
		page: pageNumber,
		pageDefaultSize: pageSize,
		pageCount: getPageCount(documentsCount, pageSize),
		itemCount: documentsCount,
		items: mapDocumentVersionDetails(mapDocument)
	};
};

/**
 * Returns a list of folderIds and their parentFolderIds
 *
 * @param {number} folderId
 * @param {Array<{ id: number, parentFolderId: number | null }>} folderList
 * @returns {Promise<Array<{ id: number, parentFolderId: number | null }>>}
 */
export const getChildFolders = async (folderId, folderList = []) => {
	const currentLevelFolderList = await folderRepository.getFoldersByParentId(folderId, {
		select: { id: true, parentFolderId: true }
	});
	folderList.push(...currentLevelFolderList);

	await Promise.all(currentLevelFolderList.map((folder) => getChildFolders(folder.id, folderList)));
	return folderList;
};

/**
 * Creates a folder, either at the top-level or inside a parent folder.
 *
 * @param {number} applicationId
 * @param {string} folderName
 * @param {number} [parentFolderId]
 * @returns {Promise<FolderDetails>}
 * */
export const createFolder = async (applicationId, folderName, parentFolderId) => {
	const input = {
		displayNameEn: folderName,
		caseId: applicationId,
		parentFolderId: parentFolderId ?? null,
		displayOrder: 100
	};

	const folder = await folderRepository.createFolder(input);
	if (!folder) {
		throw new Error(`Failed to create folder: ${input}`);
	}

	return mapSingleFolderDetails(folder);
};

/**
 * Updates a folder by its ID
 *
 * @param {number} id
 * @param {{ name: string }} payload
 * @throws {Error}
 * @returns {Promise<FolderDetails>}
 * */
export const updateFolder = async (id, { name }) => {
	const input = { displayNameEn: name };

	const folder = await folderRepository.updateFolderById(id, input);
	if (!folder) {
		throw new Error(`Failed to update folder ${id} with payload ${input}`);
	}

	return mapSingleFolderDetails(folder);
};

/**
 *
 * @param {Array<{ id: number, parentFolderId?: number | null, containsDocuments?: boolean | null }>} folderList
 */
export const checkFoldersHaveNoDocuments = async (folderList) => {
	await Promise.all(
		folderList.map(async (folder) =>
			documentRepository.doesDocumentsExistInFolder(folder.id).then((result) => {
				folder.containsDocuments = result;
			})
		)
	);
	return folderList;
};
