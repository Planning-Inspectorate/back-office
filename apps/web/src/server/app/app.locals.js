import pino from '../lib/logger.js';

/**
 * Validate and register the params for the upload file
 *
 * @type {import('express').RequestHandler<*, *, *, *, {caseId: string, adviceId: string}>}
 */
export const registerS51UploadParams = ({ params }, response, next) => {
	const { caseId, adviceId } = params;

	if (isNaN(Number(caseId)) || isNaN(Number(adviceId))) {
		pino.error(`[WEB] Bad params for s51 file upload. Advice id: ${adviceId}`);
		return response.render(`app/500.njk`);
	}

	response.locals.caseId = String(params.caseId) || '';
	response.locals.adviceId = String(params.adviceId) || '';

	next();
};

/**
 * Validate and register the params for the download file url
 *
 * @type {import('express').RequestHandler<*, *, *, *, {fileGuid: string, caseId: string, version: string}>}
 */
export const registerDownloadParams = ({ params }, response, next) => {
	const { guid, caseId, version } = params;

	if (!/^[A-Za-z0-9-]+$/.test(guid) || isNaN(Number(caseId)) || isNaN(Number(version))) {
		pino.error(`[WEB] Bad params for file download ${guid}`);
		return response.render(`app/500.njk`);
	}

	response.locals.fileGuid = String(guid) || '';
	response.locals.caseId = String(params.caseId) || '';
	response.locals.version = String(params.version) || '';

	next();
};
