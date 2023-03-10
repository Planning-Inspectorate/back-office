import { databaseConnector } from '../utils/database-connector.js';

/**
 * @param {any} metadata
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion>}
 */
export const upsert = (metadata) => {
	return databaseConnector.documentVersion.upsert({
		create: { ...metadata, Document: { connect: { guid: metadata?.documentGuid } } },
		where: { documentGuid: metadata?.documentGuid },
		update: metadata,
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
 * @param {{guid: string, status: import('xstate').StateValue }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion>}
 */
export const updateDocumentStatus = ({ guid, status }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid: guid },
		data: { publishedStatus: status }
	});
};

/**
 * Get a document metadata by documentGuid
 *
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentVersion |null>}
 */
export const getById = (documentGuid) => {
	return databaseConnector.documentVersion.findUnique({
		where: {
			documentGuid
		},
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
export const update = (documentGuid, documentDetails) => {
	return databaseConnector.documentVersion.update({
		where: {
			documentGuid
		},
		data: documentDetails
	});
};
