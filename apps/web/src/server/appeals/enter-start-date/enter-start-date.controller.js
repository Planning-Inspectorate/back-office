import logger from '../../lib/logger.js';
import * as appealDetailsService from '../appeal-details/appeal-details.service.js';
import * as enterStartDateService from './enter-start-date.service.js';

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
export const postEnterStartDate = async ({ params: { appealId }, body, errors }, response) => {
	// If it fails validations
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
	// If it succeeds validation
	try {
		// Prepends 0 for single digit day and months
		const day = body['start-date-day'].padStart(2, '0');
		const month = body['start-date-month'].padStart(2, '0');
		const year = body['start-date-year'];

		// Format the date
		const fullDate = `${year}-${month}-${day}`;
		const resultOfUpdatingStartDate = await enterStartDateService.setStartDateById(appealId, {
			startedAt: fullDate
		});

		logger.debug(resultOfUpdatingStartDate);
		response.redirect(`/appeals-service/appeal-details/${appealId}/start-date-entered`);
	} catch (error) {
		logger.error(error, 'Something went wrong when setting the start date');

		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(appealId)
			.catch((getAppealError) => logger.error(getAppealError));

		if (!appealDetails) {
			return response.render(`app/500.njk`);
		}

		return response.render('appeals/appeal/enter-start-date.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference
			},
			error
		});
	}
};
