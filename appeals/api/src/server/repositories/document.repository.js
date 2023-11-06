import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersions} DocumentVersions */
/** @typedef {import('@pins/appeals.api').Appeals.UpdateDocumentsRequest} UpdateDocumentsRequest */

/**
 * @param {string} guid
 * @returns {PrismaPromise<Document|null>}
 */
export const getDocumentById = (guid) => {
	return databaseConnector.document.findUnique({
		where: { guid },
		include: {
			latestDocumentVersion: true
		}
	});
};

/**
 * @param {string} guid
 * @returns {PrismaPromise<DocumentVersions|null>}
 */
export const getDocumentWithAllVersionsById = (guid) => {
	return databaseConnector.document.findUnique({
		where: { guid },
		include: {
			documentVersion: true,
			versionAudit: {
				include: {
					auditTrail: {
						include: {
							user: true
						}
					}
				}
			}
		}
	});
};

/**
 * @param {number} caseId
 * @returns {PrismaPromise<Document[]>}
 */
export const getDocumentsByAppealId = (caseId) => {
	return databaseConnector.document.findMany({
		where: {
			isDeleted: false,
			caseId
		},
		include: { latestDocumentVersion: true }
	});
};

/**
 * @param {{folderId: number, skipValue: number, pageSize: number, documentVersion?: number}} folderId
 * @returns {PrismaPromise<Document[]>}
 */
export const getDocumentsInFolder = ({ folderId, skipValue, pageSize }) => {
	return databaseConnector.document.findMany({
		where: { folderId },
		orderBy: [{ createdAt: 'desc' }],
		skip: skipValue,
		take: pageSize,
		include: { latestDocumentVersion: true }
	});
};

/**
 * @param {UpdateDocumentsRequest} data
 * @returns
 */
export const updateDocuments = (data) =>
	Promise.all(
		data.map((document) =>
			databaseConnector.documentVersion.update({
				data: {
					dateReceived: document.receivedDate,
					redactionStatus: {
						connect: {
							id: document.redactionStatus
						}
					},
					published: true
				},
				where: { documentGuid_version: { documentGuid: document.id, version: 1 } }
			})
		)
	);
