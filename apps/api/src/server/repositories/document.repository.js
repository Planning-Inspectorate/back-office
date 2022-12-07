import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {{name: string, folderId: number}} document
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document>}
 */
export const upsert = (document) => {
	return databaseConnector.document.upsert({
		create: document,
		where: { name_folderId: { name: document.name, folderId: document.folderId } },
		update: {}
	});
};

/**
 *
 * @param {string} documentGuid
 * @param {import('@pins/api').Schema.DocumentUpdateInput} documentDetails
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document>}
 */
export const update = (documentGuid, documentDetails) => {
	return databaseConnector.document.update({
		where: {
			guid: documentGuid
		},
		data: documentDetails
	});
};

/**
 * Returns array of paginated documents in a folder on a case
 *
 * @param {number} folderId
 * @param {number} skipValue
 * @param {number} pageSize
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document[]>}
 */
export const getDocumentsInFolder = (folderId, skipValue, pageSize) => {
	return databaseConnector.document.findMany({
		skip: skipValue,
		take: pageSize,
		where: { folderId }
	});
};

/**
 * Returns total number of documents in a folder on a case
 *
 * @param {number} folderId
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getDocumentsCountInFolder = (folderId) => {
	return databaseConnector.document.count({
		where: { folderId }
	});
};
