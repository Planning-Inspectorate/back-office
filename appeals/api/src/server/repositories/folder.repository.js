import { databaseConnector } from '#utils/database-connector.js';
import { defaultCaseFolders } from './folder.layout.repository.js';

/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @returns {Promise<Folder[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.folder.findMany({ where: { caseId } });
};

/**
 * Creates the top level folders on a case using the folder template
 * and recursively creates all sub folders.
 * Returns an array of promises
 *
 * @param {number} caseId
 * @returns {Promise<Folder[]>}
 */
export const upsertCaseFolders = async (caseId) => {
	const foldersCreated = [];
	for (const folder of defaultCaseFolders(caseId)) {
		const topFoldersCreated = await databaseConnector.folder.upsert({
			create: folder,
			where: { caseId_path: { caseId, path: folder.path } },
			update: { displayName: folder.displayName }
		});
		foldersCreated.push(topFoldersCreated);
	}

	return foldersCreated;
};
