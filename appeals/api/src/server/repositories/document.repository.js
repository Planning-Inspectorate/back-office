import { databaseConnector } from '../utils/database-connector.js';

/** @typedef {import('apps/api/src/database/schema.js').Document} Document */

/**
 *
 * @param {{name: string, caseId: number, folderId: number, latestVersionId?: number}} document
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document>}
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
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document |null>}
 */
export const getById = (documentGuid) => {
	return databaseConnector.document.findUnique({
		where: {
			guid: documentGuid
		}
	});
};

/**
 * Get a document by documentGuid and caseId
 *
 * @param {string} documentGuid
 * @param {number} caseId
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document |null>}
 */
export const getByIdRelatedToCaseId = (documentGuid, caseId) => {
	return databaseConnector.document.findFirst({
		include: { documentVersion: true },
		where: {
			guid: documentGuid,
			isDeleted: false,
			folder: {
				caseId
			}
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
 * From a given list of document ids, retrieve the ones which are publishable
 *
 * @param {string[]} documentIds
 * @returns {Promise<{guid: string, latestVersionId: number}[]>}
 */
export const getPublishableDocuments = (documentIds) => {
	// @ts-ignore - if there is a latestDocumentVersion, there will be a latestVerionid
	return databaseConnector.document.findMany({
		where: {
			guid: {
				in: documentIds
			},
			latestDocumentVersion: {
				NOT: {
					OR: [
						// TODO: Move name from Document.name to DocumentVersion.fileName
						{
							fileName: ''
						},
						{
							fileName: null
						},
						{
							filter1: ''
						},
						{
							filter1: null
						},
						{
							author: ''
						},
						{
							author: null
						},
						{
							description: ''
						},
						{
							description: null
						}
					]
				}
			}
		},
		select: {
			guid: true,
			latestVersionId: true
		}
	});
};

/**
 *
 * @param {string} documentId
 * @param {import('@pins/appeals.api').Schema.DocumentUpdateInput} documentDetails
 * @returns {Promise<import('@pins/appeals.api').Schema.Document>}
 */
export const update = (documentId, documentDetails) => {
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
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document>}
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
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document[]>}
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

/**
 *
 * @param {string} documentGUID
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document | null>}
 */
export const getByDocumentGUID = (documentGUID) => {
	return databaseConnector.document.findUnique({
		include: {
			documentVersion: true
		},
		where: {
			guid: documentGUID
		}
	});
};

/**
 * @param {{guid: string, status: import('xstate').StateValue }} documentStatusUpdate
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document>}
 */
export const updateDocumentStatus = ({ guid, status }) => {
	return databaseConnector.document.update({
		include: {
			documentVersion: true,
			folder: true
		},
		where: { guid },
		data: { status }
	});
};

/**
 * Returns total number of documents in a folder on a case
 *
 * @param {number} folderId
 * @param {boolean} getAllDocuments
 * @returns {import('#db-client').PrismaPromise<number>}
 */
export const getDocumentsCountInFolder = (folderId, getAllDocuments = false) => {
	/** @type {{folderId: number, isDeleted?:boolean}} */
	const where = { folderId };

	if (getAllDocuments) {
		where.isDeleted = true;
	}

	return databaseConnector.document.count({
		where
	});
};

/**
 * Filter document table to retrieve documents by 'ready-to-publish' status
 *
 * @param {{skipValue: number, pageSize: number, caseId: number, documentVersion?: number}} params
 * @returns {import('#db-client').PrismaPromise<import('@pins/appeals.api').Schema.Document[]>}
 */
export const getDocumentsReadyPublishStatus = ({
	skipValue,
	pageSize,
	caseId,
	documentVersion = 1
}) => {
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
			caseId,
			documentVersion: {
				some: {
					version: documentVersion,
					publishedStatus: 'ready_to_publish'
				}
			}
		}
	});
};

/**
 * Returns total number of documents by published status (ready-to-publish)
 *
 * @param {number} documentVersion
 * @returns {import('#db-client').PrismaPromise<number>}
 */
export const getDocumentsCountInByPublishStatus = (documentVersion = 1) => {
	return databaseConnector.document.count({
		where: {
			isDeleted: true,
			documentVersion: {
				some: {
					version: documentVersion,
					publishedStatus: 'ready_to_publish'
				}
			}
		}
	});
};
