import pino from '../lib/logger.js';

/**
 * Register the caseId retrieved from the URL for the resumed step of the ApplicationsCreate process.
 *
 * @type {import('express').RequestHandler<*, *, *, *, {downloadParams: {fileGuid: string, caseId: string, version: number}}>}
 */
export const registerDownloadParams = ({ params }, response, next) => {
	const { guid: fileGuid, caseId, version } = params;

	if (!/^[A-Za-z0-9-]+$/.test(fileGuid) || Number(caseId) < 0 || Number(version) < 0) {
		pino.error(`[WEB] Bad params for file download ${fileGuid}`);
		return response.render(`app/404.njk`);
	}

	response.locals.downloadParams = { fileGuid, caseId, version };
	next();
};
