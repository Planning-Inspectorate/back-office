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

// TODO: BOAT-105
import { patch } from '../../lib/request.js';

/** @type {import('@pins/express').RequestHandler<Response>} */

export const postEnterStartDate = async ({ body, params: { appealId }, errors }, response) => {
	const startDateDay = body?.['start-date-day'];
	const startDateMonth = body?.['start-date-month'];
	const startDateYear = body?.['start-date-year'];

	if (errors) {
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			return response.render('appeals/appeal/enter-start-date.njk', {
				appeal: {
					id: appealDetails?.appealId,
					reference: appealDetails?.appealReference
				},
				errors
			});
		}

		return response.render(`app/500.njk`);
	}

	// TODO: move into service and add error handling as part of BOAT-105
	await patch(`appeals/${appealId}`, {
		json: {
			startedAt: `${startDateYear}-${startDateMonth}-${startDateDay}`
		}
	});

	response.redirect(`/appeals-service/appeal-details/${appealId}/start-date-entered`);
};
