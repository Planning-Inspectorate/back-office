import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAssignCaseOfficer = async (request, response) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	const appealReferenceFragments = appealDetails?.appealReference.split('/');

	if (appealDetails) {
		return response.render('appeals/appeal/assign-team-members.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			teamMemberType: 'case officer',
			errors
		});
	}

	return response.render('app/404.njk');
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignCaseOfficer = async (request, response) => {
	renderAssignCaseOfficer(request, response);
};
