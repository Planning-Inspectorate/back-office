import { databaseConnector } from '../utils/database-connector.js';

/**
 * @param {import('apps/api/prisma/schema.js').DocumentMetadata} metadata
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentMetadata>}
 */
export const upsert = (metadata) => {
	return databaseConnector.documentMetadata.upsert({
		create: { ...metadata, Document: { connect: { guid: metadata?.documentGuid } } },
		where: { id: metadata.id },
		update: metadata,
		include: {
			Document: true
		}
	});
};

/**
 * Get a document by documentGuid
 *
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.DocumentMetadata |null>}
 */
export const getById = (documentGuid) => {
	return databaseConnector.documentMetadata.findFirst({
		where: {
			documentGuid
		},
		orderBy: {
			dateCreated: 'desc'
		},
		take: 1
	});
};
