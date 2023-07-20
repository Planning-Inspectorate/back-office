import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */

/**
 * @param {number} id
 * @returns {PrismaPromise<Folder|null>}
 */
export const getById = (id) => {
	return databaseConnector.folder.findUnique({
		where: { id }
	});
};

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @returns {PrismaPromise<Folder[]>}
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
 * @returns {PrismaPromise<Folder[]>}
 */
export const getByCaseIdPath = (caseId, path) => {
	return databaseConnector.folder.findMany({
		where: {
			caseId,
			path: { startsWith: path }
		},
		include: { documents: true }
	});
};
