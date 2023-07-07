import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * Get a document by its guid
 *
 * @param {string} documentGuid
 * @returns {PrismaPromise<Document | null>}
 */
export const getDocumentById = (documentGuid) => {
	return databaseConnector.document.findUnique({
		include: {
			latestDocumentVersion: true
		},
		where: {
			guid: documentGuid
		}
	});
};

/**
 * Get a document by its guid
 *
 * @param {string} documentGuid
 * @returns {PrismaPromise<Document | null>}
 */
export const getDocumentWithAllVersionsById = (documentGuid) => {
	return databaseConnector.document.findUnique({
		include: {
			documentVersion: true,
			latestDocumentVersion: true
		},
		where: {
			guid: documentGuid
		}
	});
};

/**
 * Get all the documents for a caseId
 *
 * @param {number} caseId
 * @returns {PrismaPromise<Document[]>}
 */
export const getDocumentsByAppealId = (caseId) => {
	return databaseConnector.document.findMany({
		include: { latestDocumentVersion: true },
		where: {
			isDeleted: false,
			folder: {
				caseId
			}
		}
	});
};

/**
 *  Deletes a document from the database based on its `guid`
 *
 * @async
 * @param {string} documentGuid
 * @returns {PrismaPromise<Document>}
 */
export const deleteDocument = (documentGuid) => {
	return databaseConnector.document.delete({
		where: {
			guid: documentGuid
		}
	});
};

/**
 *
 * @param {{folderId: number, skipValue: number, pageSize: number, documentVersion?: number}} folderId
 * @returns {PrismaPromise<Document[]>}
 */
export const getDocumentsInFolder = ({ folderId, skipValue, pageSize, documentVersion = 1 }) => {
	return databaseConnector.document.findMany({
		include: {
			documentVersion: true,
			folder: true
		},
		skip: skipValue,
		take: pageSize,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			folderId,
			documentVersion: {
				some: {
					version: documentVersion
				}
			}
		}
	});
};
