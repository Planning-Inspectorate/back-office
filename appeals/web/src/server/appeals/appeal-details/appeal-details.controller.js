import logger from '../../lib/logger.js';
import * as appealDetailsService from './appeal-details.service.js';
import { appealDetailsPage } from './appeal-details.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const viewAppealDetails = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	const session = request.session;

	if (appealDetails) {
		const currentUrl = request.originalUrl;
		const mappedPageContent = await appealDetailsPage(appealDetails, currentUrl, session);

		response.render('patterns/display-page.pattern.njk', {
			pageContent: mappedPageContent
		});
	} else {
		response.render('app/404.njk');
	}
};
