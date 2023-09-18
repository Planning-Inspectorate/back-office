import logger from '../../lib/logger.js';
import * as appealDetailsService from './appeal-details.service.js';
import { appealDetailsPage, backLink, pageHeading } from './appeal-details.mapper.js';

/**
 * @typedef {Object} ViewAppealDetailsRenderOptions
 * @property {Object} backLink
 * @property {string} pageHeading
 * @property {string | null | undefined} appealReference
 * @property {Object} pageContents
 */

/** @type {import('@pins/express').RenderHandler<ViewAppealDetailsRenderOptions>}  */
export const viewAppealDetails = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	const session = request.session;

	if (appealDetails) {
		const currentUrl = request.originalUrl;
		const pageComponents = await appealDetailsPage({ appeal: appealDetails }, currentUrl, session);

		response.render('patterns/display-page.pattern.njk', {
			backLink: backLink,
			pageHeading: pageHeading,
			appealReference: appealDetails.appealReference,
			pageContents: pageComponents
		});
	} else {
		response.render('app/404.njk');
	}
};
