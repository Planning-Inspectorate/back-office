import pino from '../lib/logger.js';

/**
 * Validate and register the adviceId for the upload file
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
 */
export const registerAdviceId = ({ params }, response, next) => {
	const { adviceId } = params;

	if (isNaN(Number(adviceId))) {
		pino.error(`[WEB] Bad advice id for s51 file upload. Advice id: ${adviceId}`);
		return response.render(`app/500.njk`);
	}

	response.locals.adviceId = String(params.adviceId) || '';

	next();
};

/**
 * Validate and register the params for the download file url
 *
 * @type {import('express').RequestHandler<*, *, *, *, *>}
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
