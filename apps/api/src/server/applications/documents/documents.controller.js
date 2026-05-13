import BackOfficeAppError from '#utils/app-error.js';
import logger from '#utils/logger.js';
import {
	extractYouTubeURLFromHTML,
	renderYouTubeTemplate,
	updateStatus
} from './documents.service.js';

/**
 * @type {import('express').RequestHandler<{caseId: string, documentGUID: string }>}
 */
export const updateDocumentStatus = async ({ params, body }, response) => {
	const updateResponse = await updateStatus(params.documentGUID, body.machineAction);

	if (!updateResponse) {
		logger.warn(
			{
				documentGuid: params.documentGUID,
				machineAction: body.machineAction
			},
			'[SHAPEFILE] updateDocumentStatus returned no document'
		);
	} else {
		logger.info(
			{
				documentGuid: params.documentGUID,
				machineAction: body.machineAction,
				status: updateResponse.status,
				documentType: updateResponse.documentType,
				hasDocumentURI: Boolean(updateResponse.documentURI),
				caseId: updateResponse.caseId
			},
			'[SHAPEFILE] updateDocumentStatus response'
		);
	}

	response.send(updateResponse);
};

/**
 * Processes arbitrary HTML file into the agreed YouTube template for Front Office
 *
 * @type {import('express').RequestHandler<any, any, { html: string }, any>}
 * */
export const processHTMLForYouTube = async ({ body }, response) => {
	const html = body.html;

	try {
		const youtubeUrl = extractYouTubeURLFromHTML(html);
		const renderedHTML = renderYouTubeTemplate(youtubeUrl);

		response.send({ html: renderedHTML });
	} catch (/** @type {*} */ err) {
		throw new BackOfficeAppError(err, 400);
	}
};
