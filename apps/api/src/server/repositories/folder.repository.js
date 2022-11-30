import { databaseConnector } from '../utils/database-connector.js';

/** @typedef {import('@pins/api').Schema.Folder} Folder */
/** @typedef {import('@pins/applications').FolderDetails} FolderDetails */

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @param {number |null} parentFolderId
 * @returns {Promise<Folder[]>}
 */
export const getByCaseId = (caseId, parentFolderId = null) => {
	// if no parentFolderId, null value in the call, to get the top level folders on the case

	return databaseConnector.folder.findMany({ where: { caseId, parentFolderId } });
};

/**
 * Returns a single folder on a case
 *
 * @param {number} folderId
 * @returns {Promise<Folder |null>}
 */
export const getFolder = (folderId) => {
	return databaseConnector.folder.findUnique({ where: { id: folderId } });
};

/**
 * find a folder in an array
 *
 * @param { Folder[] } folders
 * @param { number } id
 * @returns { Folder |null}
 */
const findFolder = (folders, id) => {
	const matchedFolder = folders.find((folder) => folder.id === id);

	return matchedFolder ?? null;
};

/**
 * Returns array of folder path (parent folders) from current folder upwards
 * used for breadcrumbs etc
 *
 * @param {number} caseId
 * @param {number} currentFolderId
 * @returns {Promise<(Folder |null)[]>}
 */
export const getFolderPath = async (caseId, currentFolderId) => {
	const allFolders = await databaseConnector.folder.findMany({ where: { caseId } });

	let folderPath = [];

	/** @type {number | null} */ let searchId = currentFolderId;
	let currentFolder;

	do {
		currentFolder = findFolder(allFolders, searchId);
		folderPath.push(currentFolder);
		searchId = currentFolder?.parentFolderId ?? null;
	} while (searchId);

	// tree is traversed in order, we want it reversed
	if (folderPath) {
		folderPath = folderPath.reverse();
	}
	return folderPath;
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const createFolders = (caseId) => {
	const createdFolders = {
		data: defaultCaseFolders.map((folder) => ({ ...folder, caseId }))
	};

	return databaseConnector.folder.createMany(createdFolders);
};

/**
 *
 * @param {number | undefined} folderId
 * @returns {Promise<import('@pins/api').Schema.Folder | null>}
 */
export const getById = (folderId) => {
	return databaseConnector.folder.findUnique({ where: { id: folderId } });
};

export const defaultCaseFolders = [
	{ displayNameEn: 'Project management', displayOrder: 100 },
	{ displayNameEn: 'Legal advice', displayOrder: 200 },
	{ displayNameEn: 'Transboundary', displayOrder: 300 },
	{ displayNameEn: 'Land rights', displayOrder: 400 },
	{ displayNameEn: 'S51 advice', displayOrder: 500 },
	{ displayNameEn: 'Pre-application', displayOrder: 600 },
	{ displayNameEn: 'Acceptance', displayOrder: 700 },
	{ displayNameEn: 'Pre-examination', displayOrder: 800 },
	{ displayNameEn: 'Relevant representations', displayOrder: 900 },
	{ displayNameEn: 'Examination', displayOrder: 1000 },
	{ displayNameEn: 'Recommendation', displayOrder: 1100 },
	{ displayNameEn: 'Decision', displayOrder: 1200 },
	{ displayNameEn: 'Post-decision', displayOrder: 1300 }
];
