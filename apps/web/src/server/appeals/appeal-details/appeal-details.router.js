import { Router as createRouter } from 'express';
import * as controller from './appeal-details.controller.js';

const router = createRouter();

router.route('/:appealId').get(controller.viewAppealDetails);

// TODO: BOAT-103, BOAT-104 (router and controller for setting start date)
import logger from '../../lib/logger.js';
import * as appealDetailsService from './appeal-details.service.js';

router.route('/:appealId/enter-start-date').get(async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		response.render('appeals/appeal/enter-start-date.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference
			}
		});
	}
});

router.route('/:appealId/start-date-entered').get(async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		response.render('appeals/appeal/start-date-entered.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference
			}
		});
	}
});

export default router;
