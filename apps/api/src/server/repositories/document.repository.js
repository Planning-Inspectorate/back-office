import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@prisma/client').Prisma.DocumentGetPayload<{include: {documentVersion: true }}>} DocumentWithDocumentVersion
 */

/**
 * Create a new Document record
 *
 * @param {import('@prisma/client').Prisma.DocumentUncheckedCreateInput} document
 * @returns {import('@prisma/client').PrismaPromise<Document>}
 */
export const create = (document) => {
	return databaseConnector.document.create({
		data: document
	});
};

/**
 * Get a document by documentGuid
 *
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<Document |null>}
 */
export const getById = (documentGuid) => {
	return databaseConnector.document.findUnique({
		where: {
			guid: documentGuid
		}
	});
};

/**
 * Get a paginated array of documents by caseid
 *
 * @param {{ caseId: number, skipValue?: number, pageSize?: number }} _
 * @returns {import('@prisma/client').PrismaPromise<Document[]>}
 */
export const getByCaseId = ({ caseId, skipValue, pageSize }) => {
	return databaseConnector.document.findMany({
		where: { caseId, isDeleted: false },
		skip: skipValue,
		take: pageSize,
		orderBy: [
			{
				createdAt: 'desc'
			}
		]
	});
};

/**
 * Get a document by documentGuid
 *
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<DocumentWithDocumentVersion |null>}
 */
export const getByIdWithVersion = (documentGuid) => {
	return databaseConnector.document.findUnique({
		include: { documentVersion: true },
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
 * @returns {import('@prisma/client').PrismaPromise<Document |null>}
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
			},
			isDeleted: false
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
 * @param {import('@pins/applications.api').Schema.DocumentUpdateInput} documentDetails
 * @returns {Promise<Document>}
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
 * TODO: check - this does an actual delete, not a soft delete, is that correct?
 *
 * @async
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<Document>}
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
 * @returns {import('@prisma/client').PrismaPromise<Document[]>}
 */
export const getDocumentsInFolder = ({ folderId, skipValue, pageSize, documentVersion = 1 }) => {
	return databaseConnector.document.findMany({
		include: {
			documentVersion: true,
			latestDocumentVersion: true,
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
			},
			isDeleted: false
		}
	});
};

/**
 *
 * @param {number} folderId
 *  @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const countDocumentsInFolder = (folderId) => {
	return databaseConnector.document.count({
		where: {
			folderId,
			isDeleted: false
		}
	});
};

/**
 *
 * @param {string} documentGUID
 * @returns {import('@prisma/client').PrismaPromise<Document | null>}
 */
export const getByDocumentGUID = (documentGUID) => {
	return databaseConnector.document.findUnique({
		include: {
			latestDocumentVersion: true
		},
		where: {
			guid: documentGUID
		}
	});
};

/**
 *
 * @param {string[]} guids
 * @returns {import('@prisma/client').PrismaPromise<DocumentWithDocumentVersion[] | null>}
 * */
export const getDocumentsByGUID = (guids) =>
	databaseConnector.document.findMany({
		where: {
			guid: {
				in: guids
			},
			isDeleted: false
		},
		include: {
			documentVersion: true
		}
	});

/**
 * TODO: I dont think this fn is used anymore
 * @param {{guid: string, status: import('xstate').StateValue }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<Document>}
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
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getDocumentsCountInFolder = (folderId, getAllDocuments = false) => {
	/** @type {{folderId: number, isDeleted?:boolean}} */
	const where = { folderId };

	if (!getAllDocuments) {
		where.isDeleted = false;
	}

	return databaseConnector.document.count({
		where
	});
};

/**
 * Filter document table to retrieve documents by 'ready-to-publish' status
 *
 * @param {{skipValue: number, pageSize: number, caseId: number, documentVersion?: number}} params
 * @returns {import('@prisma/client').PrismaPromise<Document[]>}
 */
export const getDocumentsReadyPublishStatus = ({ skipValue, pageSize, caseId }) => {
	return databaseConnector.document.findMany({
		include: {
			latestDocumentVersion: true,
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
			latestDocumentVersion: {
				publishedStatus: 'ready_to_publish'
			},
			isDeleted: false
		}
	});
};

/**
 * Returns total number of documents by published status (ready-to-publish)
 *
 * @param {number} caseId
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getDocumentsCountInByPublishStatus = (caseId) => {
	console.info('getDocumentsCountInByPublishStatus for case ' + caseId);
	return databaseConnector.document.count({
		where: {
			caseId,
			latestDocumentVersion: {
				publishedStatus: 'ready_to_publish'
			},
			isDeleted: false
		}
	});
};

/**
 * Returns the file with a given name in the given folder
 *
 * @param {number} folderId
 * @param {string} fileName
 * @param {boolean} [includeDeleted]
 * @returns {import('@prisma/client').PrismaPromise<Document | null>}
 */
export const getInFolderByName = (folderId, fileName, includeDeleted) =>
	databaseConnector.document.findFirst({
		where: {
			folderId,
			latestDocumentVersion: { originalFilename: fileName },
			...(includeDeleted ? {} : { isDeleted: false })
		}
	});
