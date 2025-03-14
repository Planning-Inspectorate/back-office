import * as documentRepository from '#repositories/document.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import { getPageCount, getSkipValue } from '#utils/database-pagination.js';
import logger from '#utils/logger.js';
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
 * @param {number} caseId
 * @param {number} folderId
 * @returns {Promise<FolderDetails[] |null>}
 */
export const getFolderPath = async (caseId, folderId) => {
	const folders = await folderRepository.getFolderPath(caseId, folderId);
	// @ts-ignore
	return mapBreadcrumbFolderDetails(folders);
};

/**
 * Returns the orderBy field and direction given a sortBy value
 * @param {string} sortBy
 */
const getOrderBy = (sortBy = '-dateCreated') => {
	const sortDirection = sortBy.startsWith('-') ? 'desc' : 'asc';
	const sortField = sortBy.replace('-', '');

	return [
		{ latestDocumentVersion: { [sortField]: sortDirection } },
		// If the sort field is not dateCreated, then sort by dateCreated as a secondary sort field
		...(sortField !== 'dateCreated' ? [{ latestDocumentVersion: { dateCreated: 'desc' } }] : [])
	]
};

/**
 * Returns paginated array of documents in a folder on a case
 *
 * @param {number} folderId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {string} sortBy
 * @returns {Promise<PaginatedDocumentDetails>}
 */
export const getDocumentsInFolder = async (folderId, pageNumber = 1, pageSize = 50, sortBy) => {
	const skipValue = getSkipValue(pageNumber, pageSize);
	const orderBy = getOrderBy(sortBy);
	const documentsCount = await documentRepository.getDocumentsCountInFolder(folderId);
	const documents = await documentRepository.getDocumentsInFolder(folderId, {
		skip: skipValue,
		take: pageSize,
		orderBy
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
 * @returns {Promise<Array<{ id: number, parentFolderId: number | null }>>}
 */
export const getChildFolders = async (folderId) => {
	try {
		const currentLevelFolderList = await folderRepository.getFoldersByParentId(folderId, {
			select: { id: true, parentFolderId: true },
			where: { parentFolderId: folderId, isCustom: true }
		});

		const childFoldersPromises = currentLevelFolderList.map((folder) => getChildFolders(folder.id));
		const results = await Promise.allSettled(childFoldersPromises);

		const childFolders = results.flatMap((result) => {
			if (result.status === 'fulfilled') {
				return result.value;
			} else {
				logger.error(`Failed to fetch child folders for folderId ${folderId}: ${result.reason}`);
				return [];
			}
		});

		return [...currentLevelFolderList, ...childFolders];
	} catch (error) {
		logger.error(`Failed to fetch folders for parentFolderId ${folderId}: ${error}`);
		throw error;
	}
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
		displayOrder: 100,
		stage: await getParentFolderStage(parentFolderId)
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
 * @param {number} folderId
 * @returns {Promise<boolean | undefined>}
 */
export const checkIfFolderIsCustom = async (folderId) => {
	const folder = await folderRepository.getById(folderId);
	return folder?.isCustom;
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

/**
 * @param {number | undefined} parentFolderId
 */
const getParentFolderStage = async (parentFolderId) => {
	if (!parentFolderId) return null;

	const folderObject = await folderRepository.getById(parentFolderId);
	return folderObject?.stage ?? null;
};
