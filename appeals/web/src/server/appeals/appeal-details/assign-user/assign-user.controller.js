import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import { getUsersByRole } from '../../appeal-users/users-service.js';
import config from '#environment/config.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAssignUser = async (request, response, isInspector = false) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	const appealReferenceFragments = appealDetails?.appealReference.split('/');
	const userType = isInspector ? 'inspector' : 'case officer';

	const caseOfficers = await getUsersByRole(
		config.referenceData.appeals.caseOfficerGroupId,
		request.session
	);

	console.log(JSON.stringify(caseOfficers));

	if (appealDetails) {
		return response.render('appeals/appeal/assign-user.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			userType,
			search: {
				term: '',
				results: ['']
			},
			errors
		});
	}

	return response.render('app/404.njk');
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignCaseOfficer = async (request, response) => {
	renderAssignUser(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignInspector = async (request, response) => {
	renderAssignUser(request, response, true);
};
