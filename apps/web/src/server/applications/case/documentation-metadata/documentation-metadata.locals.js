import { getCaseDocumentationFileInfo } from '../documentation/applications-documentation.service.js';
import pino from './../../../lib/logger.js';
/**
 * Register url parameters.
 *
 * @type {import('express').RequestHandler<{caseId: string, documentGuid: string, folderId: string}>}
 */
export const registerUrlParameters = async ({ params }, response, next) => {
	const { caseId, documentGuid, folderId } = params;

	response.locals.folderId = Number.parseInt(`${folderId}`, 10);
	response.locals.caseId = Number.parseInt(`${caseId}`, 10);
	response.locals.documentGuid = documentGuid;

	next();
};

/**
 * Register the metadata for the given document.
 *
 * @type {import('express').RequestHandler<{caseId: string, documentGuid: string}>}
 */
export const registerDocumentMetaData = async ({ params }, response, next) => {
	const { caseId, documentGuid: unparsedDocumentGuid } = params;

	const documentGuid = String(unparsedDocumentGuid);
	if (!/^[A-Za-z0-9-]+$/.test(documentGuid)) {
		pino.error(`[WEB] Wrong document guid: ${documentGuid}`);
		return response.render(`app/500.njk`);
	}

	const documentMetaData = await getCaseDocumentationFileInfo(
		Number.parseInt(caseId, 10),
		documentGuid
	);

	response.locals.documentMetaData = documentMetaData;

	next();
};
