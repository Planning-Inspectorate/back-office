import { databaseConnector } from '../utils/database-connector.js';

/**
 
 * @param {any} metadata
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion>}
 */

export const upsert = ({ documentGuid, version = 1, ...metadata }) => {
	return databaseConnector.documentVersion.upsert({
		create: { ...metadata, version, Document: { connect: { guid: documentGuid } } },

		where: { documentGuid_version: { documentGuid, version } },

		update: { ...metadata, version },

		include: {
			Document: {
				include: {
					folder: {
						include: {
							case: {
								include: {
									CaseStatus: true
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
 
 * @param {{guid: string, status: string, version?: number }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion>}
 */

export const updateDocumentStatus = ({ guid, status, version = 1 }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid: guid, version } },
		data: { publishedStatus: status }
	});
};

/**
 *  Deletes a document from the database based on its `guid`
 *
 * @async
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion>}
 */
export const deleteDocument = (documentGuid) => {
	return databaseConnector.document.delete({
		where: {
			guid: documentGuid
		}
	});
};

/**
 
 * Get a document metadata by documentGuid
 *
 * @param {string} documentGuid
 * @param {number} version
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion |null>}
 */

export const getById = (documentGuid, version = 1) => {
	return databaseConnector.documentVersion.findUnique({
		where: { documentGuid_version: { documentGuid, version } },

		include: {
			Document: {
				include: {
					folder: {
						include: {
							case: {
								include: {
									CaseStatus: true
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
 
 * Get all document metadata
 
 *
 
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion[] |null>}
 */

export const getAll = () => {
	return databaseConnector.documentVersion.findMany();
};

/**
 
 *
 
 * @param {string} documentGuid
 * @param {import('@pins/api').Schema.DocumentVersionUpdateInput} documentDetails
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion>}
 */

export const update = (documentGuid, { version = 1, ...documentDetails }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid, version } },

		data: documentDetails
	});
};
