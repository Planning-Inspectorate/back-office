import { getDocumentMetaData } from './documentation-metadata.service.js';

/**
 * Register url parameters.
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerUrlParameters = async ({ params }, response, next) => {
	const { caseId, documentGuid, folderId } = params;

	response.locals.folderId = Number.parseInt(folderId, 10);
	response.locals.caseId = Number.parseInt(caseId, 10);
	response.locals.documentGuid = documentGuid;

	next();
};

/**
 * Register the metadata for the given document.
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerDocumentMetaData = async ({ params }, response, next) => {
	const { caseId, documentGuid } = params;

	const documentMetaData = await getDocumentMetaData(caseId, documentGuid);

	response.locals.documentMetaData = documentMetaData;

	next();
};
