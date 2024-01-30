import { objectContainsAllKeys } from '#lib/object-utilities.js';
import { decisionValidConfirmationPage } from './outcome-valid.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderDecisionValidConfirmationPage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;
	const mappedPageContent = decisionValidConfirmationPage(appealId, appealReference);

	response.render('appeals/confirmation.njk', mappedPageContent);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getConfirmation = async (request, response) => {
	renderDecisionValidConfirmationPage(request, response);
};
