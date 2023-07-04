import { databaseConnector } from '../utils/database-connector.js';
/** @typedef {import('apps/api/src/database/schema.js').Document} Document */
/** @typedef {import('apps/api/src/database/schema.js').DocumentVersion} DocumentVersion */

/**

 * @param {any} metadata
 * @returns {import('#db-client').PrismaPromise<DocumentVersion>}
 */

export const upsertDocumentVersion = ({ documentGuid, version = 1, ...metadata }) => {
	return databaseConnector.documentVersion.upsert({
		create: { ...metadata, version, Document: { connect: { guid: documentGuid } } },

		where: { documentGuid_version: { documentGuid, version } },

		update: { ...metadata, version },

		include: {
			Document: {
				include: {
					folder: {}
				}
			}
		}
	});
};

/**
 * Get all document metadata
 *
 * @param {string} guid
 * @returns {import('#db-client').PrismaPromise<DocumentVersion[] |null>}
 */

export const getAllByDocumentGuid = (guid) => {
	return databaseConnector.documentVersion.findMany({
		where: { documentGuid: guid }
	});
};
