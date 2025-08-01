import { databaseConnector } from '#utils/database-connector.js';
import { getFileNameWithoutSuffix } from '../applications/application/documents/document.service.js';

/**
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@prisma/client').Prisma.DocumentGetPayload<{include: {documentVersion: true }}>} DocumentWithDocumentVersion
 */

/** @typedef {Object} LatestDocumentVersion
 * @property {string} mime
 * @property {string=} filter1Welsh
 * @property {string=} authorWelsh
 * @property {string=} descriptionWelsh
 * @property {{case: {ApplicationDetails: {regions: [{region: {name: string}}]}}}} Document

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

export const getDocumentVersionsByCaseId = async (caseId) => {
	try {
		const documents = await databaseConnector.document.findMany({
			where: {
				caseId: caseId,
				isDeleted: false
			},
			select: {
				guid: true
			}
		});

		const documentGuids = documents.map((doc) => doc.guid);
		if (documentGuids.length === 0) {
			return [];
		}

		return databaseConnector.documentVersion.findMany({
			where: {
				documentGuid: {
					in: documentGuids
				},
				isDeleted: false
			}
		});
	} catch (error) {
		console.error('Error fetching document versions:', error);
		throw error;
	}
};

/**
 * Get latest document reference (excluding ones from migration (with -M-)
 * Includes deleted docs, and orders by documentReference descending
 *
 * @param {{ caseId: number, skipValue?: number, pageSize?: number }} _
 * @returns {Promise<string>}
 */
export const getLatestDocReferenceByCaseIdExcludingMigrated = async ({ caseId }) => {
	const latestDoc = await databaseConnector.document.findMany({
		where: {
			caseId,
			NOT: { documentReference: { contains: '-M-' } } // Migration created doc references are `${document.caseRef}-M-${documentId}`, so we want to exclude that when finding latest one
		},
		take: 1,
		orderBy: [
			{
				documentReference: 'desc'
			}
		]
	});
	return latestDoc.length > 0 ? latestDoc[0]?.documentReference : null;
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
 * Get a document by reference Number and caseId
 *
 * @param {string} documentReference
 * @param {number} caseId
 * @returns {import('@prisma/client').PrismaPromise<Document |null>}
 */
export const getByReferenceRelatedToCaseId = (documentReference, caseId) => {
	return databaseConnector.document.findFirst({
		where: {
			documentReference,
			latestVersionId: 1,
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
 * @returns {Promise<{guid: string, latestVersionId: number, latestDocumentVersion: LatestDocumentVersion}[]>}
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
						// {
						// 	mime: 'application/vnd.ms-outlook'
						// }
					]
				}
			},
			isDeleted: false
		},
		select: {
			guid: true,
			latestVersionId: true,
			latestDocumentVersion: {
				select: {
					mime: true,
					filter1Welsh: true,
					authorWelsh: true,
					descriptionWelsh: true,
					Document: {
						select: {
							case: {
								select: {
									ApplicationDetails: {
										select: {
											regions: {
												select: {
													region: {
														select: {
															name: true
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
};

/**
 * From a given list of document ids, retrieve the ones which are publishable.
 * similar to the fn getPublishableDocuments but without checking for required fields.
 * This is used for S51 Advice documents
 *
 * @param {string[]} documentIds
 * @returns {Promise<{guid: string, latestVersionId: number, latestDocumentVersion: LatestDocumentVersion}[]>}
 */
export const getPublishableDocumentsWithoutRequiredPropertiesCheck = (documentIds) => {
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
						}
					]
				}
			},
			isDeleted: false
		},
		select: {
			guid: true,
			latestVersionId: true,
			latestDocumentVersion: {
				select: {
					mime: true
				}
			}
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
 * Update the folderId and stage for an array of documents by guid
 * @param   {{documents: {documentGuid: string, fileName: string, version: number}[], destinationFolderId: number, destinationFolderStage: string}} payload
 * @returns {Promise<*>}
 */

export const updateDocumentsFolderId = ({
	destinationFolderId,
	destinationFolderStage,
	documents
}) => {
	return databaseConnector.$transaction([
		databaseConnector.document.updateMany({
			where: {
				guid: {
					in: documents.map((document) => document.documentGuid)
				}
			},
			data: {
				folderId: destinationFolderId
			}
		}),
		...documents.map((document) =>
			databaseConnector.documentVersion.updateMany({
				where: {
					documentGuid: document.documentGuid,
					version: document.version
				},
				data: {
					stage: destinationFolderStage
				}
			})
		)
	]);
};

/**
 *  Soft-Deletes a document from the database based on its `guid`
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
 * @param {number} folderId
 * @param {import('@prisma/client').Prisma.DocumentFindManyArgs} [options={}]
 * @returns {import('@prisma/client').PrismaPromise<Document[]>}
 */
export const getDocumentsInFolder = (folderId, options = {}) => {
	const orderBy = options.orderBy || {
		createdAt: 'desc'
	};
	return databaseConnector.document.findMany({
		include: {
			documentVersion: true,
			latestDocumentVersion: true,
			folder: true
		},
		where: {
			folderId,
			isDeleted: false
		},
		...options,
		orderBy
	});
};

/**
 *
 * @param {number} folderId
 * @returns {Promise<boolean>}
 */
export const doesDocumentsExistInFolder = async (folderId) => {
	const count = await databaseConnector.document.count({
		where: {
			folderId,
			isDeleted: false
		}
	});
	return count > 0;
};

/**
 * returns the where clause for getting / counting all docs in a case, exluding S51 Advice docs
 *
 * @param {number} caseId
 * @param {string} criteria
 * @param {boolean} includeDeletedDocuments
 * @param {number |undefined} s51AdviceFolderId
 * @returns {*}
 */
const buildWhereClause_AllDocsOnCaseWithoutS51Advice = (
	caseId,
	criteria,
	s51AdviceFolderId,
	includeDeletedDocuments
) => {
	const whereClause = {
		caseId,
		AND: {
			OR: [
				{
					documentReference: { contains: criteria }
				},
				{
					latestDocumentVersion: {
						OR: [
							{
								fileName: { contains: criteria }
							},
							{
								description: { contains: criteria }
							},
							{
								representative: { contains: criteria }
							},
							{
								author: { contains: criteria }
							},
							{
								mime: { contains: criteria }
							}
						]
					}
				}
			]
		},
		NOT: { folderId: s51AdviceFolderId }
	};

	if (!includeDeletedDocuments) {
		// @ts-ignore
		whereClause.isDeleted = false;
	}
	return whereClause;
};

/**
 * gets an array of all documents on a case, excluding S51 Advice documents
 *
 * @param {number} caseId
 * @param {string} criteria
 * @param {number |undefined} s51AdviceFolderId
 * @param {number} skipValue
 * @param {number} pageSize
 * @param {boolean} includeDeletedDocuments
 * @returns {import('@prisma/client').PrismaPromise<Document[]>}
 */
export const getDocumentsInCase = (
	caseId,
	criteria,
	s51AdviceFolderId,
	skipValue,
	pageSize,
	includeDeletedDocuments = false
) => {
	const whereClause = buildWhereClause_AllDocsOnCaseWithoutS51Advice(
		caseId,
		criteria,
		s51AdviceFolderId,
		includeDeletedDocuments
	);

	return databaseConnector.document.findMany({
		include: {
			documentVersion: true,
			latestDocumentVersion: true,
			folder: true
		},
		skip: skipValue,
		take: Number(pageSize),
		orderBy: [
			{
				documentReference: 'asc'
			}
		],
		where: whereClause
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
 * Returns total number of documents in a case, ignoring S51 Advice documents
 *
 * @param {number} caseId
 * @param {string} criteria
 * @param {number |undefined} s51AdviceFolderId
 * @param {boolean} includeDeletedDocuments
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getDocumentsCountInCase = (
	caseId,
	criteria,
	s51AdviceFolderId,
	includeDeletedDocuments = false
) => {
	/** @type {{caseId: number, isDeleted?:boolean}} */
	const whereClause = buildWhereClause_AllDocsOnCaseWithoutS51Advice(
		caseId,
		criteria,
		s51AdviceFolderId,
		includeDeletedDocuments
	);

	return databaseConnector.document.count({
		where: whereClause
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
export const getInFolderByName = (folderId, fileName, includeDeleted) => {
	const fileNameWithoutSuffix = getFileNameWithoutSuffix(fileName);
	return databaseConnector.document.findFirst({
		where: {
			folderId,
			latestDocumentVersion: { fileName: fileNameWithoutSuffix },
			...(includeDeleted ? {} : { isDeleted: false })
		}
	});
};
