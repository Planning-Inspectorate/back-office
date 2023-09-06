import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import { getUsersByRole, getUserByRoleAndId } from '../../appeal-users/users-service.js';
import config from '#environment/config.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {Object<string, any>[]} [usersMatchingSearchTerm]
 * @param {boolean} isInspector
 */
const renderAssignUser = async (
	request,
	response,
	usersMatchingSearchTerm,
	isInspector = false
) => {
	const {
		errors,
		body: { searchTerm }
	} = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	const appealReferenceFragments = appealDetails?.appealReference.split('/');

	if (appealDetails) {
		const results = (usersMatchingSearchTerm || []).map((user) => {
			const nameFragments = user.name.split(',');

			return {
				guid: user.id,
				name:
					nameFragments.length > 1 ? `${nameFragments[1]} ${nameFragments[0]}` : nameFragments[0],
				email: user.email
			};
		});

		return response.render('appeals/appeal/assign-user.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			isInspector,
			search: {
				term: searchTerm || '',
				performed: Array.isArray(usersMatchingSearchTerm),
				results
			},
			errors
		});
	}

	return response.render('app/404.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {boolean} isInspector
 */
const renderAssignUserCheckAndConfirm = async (request, response, isInspector = false) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	const appealReferenceFragments = appealDetails?.appealReference.split('/');

	if (appealDetails) {
		const {
			errors,
			params: { assigneeId }
		} = request;

		if (assigneeId) {
			const user = await getUserByRoleAndId(
				isInspector
					? config.referenceData.appeals.inspectorGroupId
					: config.referenceData.appeals.caseOfficerGroupId,
				assigneeId,
				request.session
			);

			return response.render('appeals/appeal/confirm-assign-user.njk', {
				appeal: {
					id: appealDetails?.appealId,
					reference: appealDetails?.appealReference,
					shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
				},
				user,
				isInspector,
				errors
			});
		}
	}

	return response.render('app/404.njk');
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignCaseOfficer = async (request, response) => {
	renderAssignUser(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignInspector = async (request, response) => {
	renderAssignUser(request, response, [], true);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAssignUser = async (request, response, isInspector = false) => {
	const { errors } = request;

	if (errors) {
		return renderAssignUser(request, response);
	}

	try {
		const { searchTerm } = request.body;

		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		const userGroupId = isInspector
			? config.referenceData.appeals.inspectorGroupId
			: config.referenceData.appeals.caseOfficerGroupId;
		const users = await getUsersByRole(userGroupId, request.session);
		const matchingUsers = users.filter(
			(user) =>
				user.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
				user.email?.toLowerCase().includes(lowerCaseSearchTerm)
		);

		return renderAssignUser(request, response, matchingUsers, isInspector);
	} catch (error) {
		logger.error(error, error instanceof Error ? error.message : 'Something went wrong');

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignCaseOfficer = async (request, response) => {
	postAssignUser(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignInspector = async (request, response) => {
	postAssignUser(request, response, true);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAssignUserCheckAndConfirm = async (request, response, isInspector = false) => {
	const { errors } = request;

	if (errors) {
		return renderAssignUserCheckAndConfirm(request, response);
	}

	try {
		const {
			body: { confirm },
			params: { appealId }
		} = request;

		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(request.apiClient, request.params.appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			if (confirm === 'yes') {
				// TODO: hit API endpoint to set appeal assigned case officer / inspector

				request.session[isInspector ? 'inspectorAssigned' : 'caseOfficerAssigned'] = true;

				return response.redirect(`/appeals-service/appeal-details/${appealId}/`);
			}

			return response.redirect(
				`/appeals-service/appeal-details/${appealId}/assign-user/${
					isInspector ? 'inspector' : 'case-officer'
				}`
			);
		}

		return response.render('app/404.njk');
	} catch (error) {
		logger.error(error, error instanceof Error ? error.message : 'Something went wrong');

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignCaseOfficerCheckAndConfirm = async (request, response) => {
	renderAssignUserCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignInspectorCheckAndConfirm = async (request, response) => {
	renderAssignUserCheckAndConfirm(request, response, true);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignCaseOfficerCheckAndConfirm = async (request, response) => {
	postAssignUserCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignInspectorCheckAndConfirm = async (request, response) => {
	postAssignUserCheckAndConfirm(request, response, true);
};
