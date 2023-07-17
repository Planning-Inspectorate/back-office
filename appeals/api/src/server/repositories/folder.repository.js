import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} id
 * @returns {Promise<Folder|null>}
 */
export const getById = (id) => {
	return databaseConnector.folder.findUnique({
		where: { id },
		include: { documents: true }
	});
};

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @returns {Promise<Folder[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.folder.findMany({
		where: { caseId },
		include: { documents: true }
	});
};

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @param {string} path
 * @returns {Promise<Folder[]>}
 */
export const getByCaseIdPath = (caseId, path) => {
	return databaseConnector.folder.findMany({
		where: {
			caseId,
			path: {
				startsWith: path
			}
		},
		include: { documents: true }
	});
};
