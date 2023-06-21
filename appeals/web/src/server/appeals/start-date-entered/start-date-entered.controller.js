import logger from '../../lib/logger.js';
import * as appealDetailsService from '../appeal-details/appeal-details.service.js';

/**
 * @typedef {object} StartDateEnteredRenderOptions
 * @property {object} appeal
 */

/** @type {import('@pins/express').RenderHandler<StartDateEnteredRenderOptions>}  */
export const getStartDateEntered = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		return response.render('appeals/appeal/start-date-entered.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference
			}
		});
	}

	return response.render(`app/404.njk`);
};
