import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {{name: string, folderId: number}} document
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document>}
 */
export const upsert = (document) => {
	return databaseConnector.document.upsert({
		create: document,
		where: { name_folderId: { name: document.name, folderId: document.folderId } },
		update: {}
	});
};

/**
 *
 * @param {string} documentGuid
 * @param {import('@pins/api').Schema.DocumentUpdateInput} documentDetails
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document>}
 */
export const update = (documentGuid, documentDetails) => {
	return databaseConnector.document.update({
		where: {
			guid: documentGuid
		},
		data: documentDetails
	});
};

/**
 *
 * @param {string} documentGUID
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document | null>}
 */
export const getByDocumentGUID = (documentGUID) => {
	return databaseConnector.document.findUnique({
		where: { guid: documentGUID }
	});
};

/**
 * @param {{guid: string, status: string }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.Document>}
 */
export const updateDocumentStatus = ({ guid, status }) => {
	return databaseConnector.document.update({
		where: { guid },
		data: { status }
	});
};
