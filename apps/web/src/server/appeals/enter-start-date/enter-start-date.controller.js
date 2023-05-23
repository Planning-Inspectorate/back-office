import logger from '../../lib/logger.js';
import * as appealDetailsService from '../appeal-details/appeal-details.service.js';

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getEnterStartDate = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		return response.render('appeals/appeal/enter-start-date.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference
			}
		});
	}

	return response.render(`app/404.njk`);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postEnterStartDate = async ({ params: { appealId }, errors }, response) => {
	if (errors) {
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(appealId)
			.catch((error) => logger.error(error));

		if (!appealDetails) {
			return response.render(`app/500.njk`);
		}

		return response.render('appeals/appeal/enter-start-date.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference
			},
			errors
		});
	}

	// TODO: BOAT-105 - call service to set start date

	response.redirect(`/appeals-service/appeal-details/${appealId}/start-date-entered`);
};
