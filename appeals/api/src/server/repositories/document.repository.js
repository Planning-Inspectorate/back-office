import { databaseConnector } from '../utils/database-connector.js';

/** @typedef {import('apps/api/src/database/schema.js').Document} Document */

/**
 *
 * @param {{name: string, caseId: number, folderId: number, latestVersionId?: number}} document
 * @returns {import('#db-client').PrismaPromise<Document>}
 */
export const upsertDocument = (document) => {
	return databaseConnector.document.upsert({
		create: document,
		where: { name_folderId: { name: document.name, folderId: document.folderId } },
		update: {}
	});
};

/**
 * Get a document by documentGuid
 *
 * @param {string} documentGuid
 * @returns {import('#db-client').PrismaPromise<Document | null>}
 */
export const getDocumentById = (documentGuid) => {
	return databaseConnector.document.findUnique({
		include: {
			documentVersion: true
		},
		where: {
			guid: documentGuid
		}
	});
};

/**
 * Get a all documents for a caseId
 *
 * @param {number} caseId
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document |null>}
 */
export const getDocumentsByAppealId = (caseId) => {
	return databaseConnector.document.findMany({
		include: { documentVersion: true },
		where: {
			isDeleted: false,
			folder: {
				caseId
			}
		}
	});
};

/**
 *
 * @param {string} documentId
 * @param {import('@pins/appeals.api').Schema.DocumentUpdateInput} documentDetails
 * @returns {Promise<import('@pins/appeals.api').Schema.Document>}
 */
export const updateDocument = (documentId, documentDetails) => {
	return databaseConnector.document.update({
		where: {
			guid: documentId
		},
		data: documentDetails
	});
};

/**
 *  Deletes a document from the database based on its `guid`
 *
 * @async
 * @param {string} documentGuid
 * @returns {import('#db-client').PrismaPromise<Document>}
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
 * @returns {import('#db-client').PrismaPromise<Document[]>}
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
