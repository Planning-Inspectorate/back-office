import pino from '../lib/logger.js';

/**
 * Validate and register the params for the download file url
 *
 * @type {import('express').RequestHandler<*, *, *, *, {fileGuid: string, caseId: string, version: string}>}
 */
export const registerDownloadParams = ({ params }, response, next) => {
	const { guid: fileGuid, caseId, version } = params;

	if (!/^[A-Za-z0-9-]+$/.test(fileGuid) || Number(caseId) < 0 || Number(version) < 0) {
		pino.error(`[WEB] Bad params for file download ${fileGuid}`);
		return response.render(`app/500.njk`);
	}

	response.locals.fileGuid = fileGuid || '';
	response.locals.caseId = String(params.caseId) || '';
	response.locals.version = String(params.version) || '';

	next();
};
