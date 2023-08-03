import { databaseConnector } from '../utils/database-connector.js';

/**

 * @param {any} metadata
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion>}
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
							// TODO: This will never work for nested folders, need to refactor to use new denormalised Case
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

 * @param {{guid: string, status: string, version?: number, datePublished?: Date }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion>}
 */

// @ts-ignore
export const updateDocumentStatus = ({ guid, status, version = 1, datePublished = null }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid: guid, version } },
		data: { publishedStatus: status, datePublished },
		include: {
			Document: {
				include: {
					case: true
				}
			}
		}
	});
};

/**
 *  Deletes a document from the database based on its `guid`
 *
 * @async
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion>}
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
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion |null>}
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

 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion[] |null>}
 */

export const getAll = () => {
	return databaseConnector.documentVersion.findMany();
};

/**
 * Get all document metadata
 *
 * @param {string} guid
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion[] |null>}
 */

export const getAllByDocumentGuid = (guid) => {
	return databaseConnector.documentVersion.findMany({
		include: { DocumentActivityLog: true },
		where: { documentGuid: guid },
		orderBy: { version: 'desc' }
	});
};

/**

 *

 * @param {string} documentGuid
 * @param {import('@pins/applications.api').Schema.DocumentVersionUpdateInput} documentDetails
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion>}
 */

export const update = (documentGuid, { version = 1, ...documentDetails }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid, version } },

		data: documentDetails
	});
};

// update DocumentVersion
// join Document on document.latestVersionId =

/**
 * TODO: Might be worth having an identifier for DocumentVersion that isn't a composite of the documentId and versionNo.
 * It would make it easier to work with these items in bulk using Prisma.
 *
 * @param {{documentGuid: string, version: number}[]} documentVersionIds
 * @param {import('@pins/applications.api').Schema.DocumentUpdateInput} documentDetails
 * @returns {Promise<import('apps/api/src/database/schema.js').DocumentVersionWithDocument[]>}
 */
export const updateAll = async (documentVersionIds, documentDetails) => {
	const results = [];

	for (const { documentGuid, version } of documentVersionIds) {
		results.push(
			await databaseConnector.documentVersion.update({
				where: { documentGuid_version: { documentGuid, version } },
				data: documentDetails,
				include: {
					Document: {
						include: {
							case: true
						}
					}
				}
			})
		);
	}

	// @ts-ignore
	return results;
};
