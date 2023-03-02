import { getDocumentMetaData } from './documentation-metadata.service.js';

/**
 * Register the metadata for the given document.
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerDocumentMetaData = async ({ params }, response, next) => {
	const { caseId, documentGuid, folderId } = params;

	const documentMetaData = await getDocumentMetaData(caseId, documentGuid);

	response.locals.folderId = Number.parseInt(folderId, 10);
	response.locals.documentMetaData = documentMetaData;

	next();
};
