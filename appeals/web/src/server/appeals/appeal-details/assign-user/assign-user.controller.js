import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import usersService from '../../appeal-users/users-service.js';
import config from '#environment/config.js';
import { setAppealAssignee } from './assign-user.service.js';
import { mapAssignedUserToSummaryListBuilderParameters } from './assign-user.mapper.js';
import { generateSummaryList } from '#lib/nunjucks-template-builders/summary-list-builder.js';
import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {boolean} [isInspector]
 * @param {Object<string, any>[]} [usersMatchingSearchTerm]
 */
const renderAssignUser = async (
	request,
	response,
	isInspector = false,
	usersMatchingSearchTerm
) => {
	const {
		errors,
		body: { searchTerm }
	} = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const currentlyAssignedUser = await mapAssignedUserToSummaryListBuilderParameters(
			appealDetails[isInspector ? 'inspector' : 'caseOfficer'],
			appealDetails.appealId,
			isInspector,
			request.session
		);

		let currentAssignee;
		if (currentlyAssignedUser) {
			currentAssignee = generateSummaryList(currentlyAssignedUser);
		}

		return response.render('appeals/appeal/assign-user.njk', {
			appeal: {
				id: appealDetails.appealId,
				reference: appealDetails.appealReference,
				shortReference: appealShortReference(appealDetails?.appealReference)
			},
			isInspector,
			currentAssignee,
			search: {
				term: searchTerm || '',
				performed: Array.isArray(usersMatchingSearchTerm),
				results: usersMatchingSearchTerm || []
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
 * @param {boolean} [isInspector]
 * @param {boolean} [isUnassign]
 */
const renderAssignOrUnassignUserCheckAndConfirm = async (
	request,
	response,
	isInspector = false,
	isUnassign = false
) => {
	try {
		const {
			errors,
			params: { assigneeId }
		} = request;

		const [appealDetails, user] = await Promise.all([
			appealDetailsService.getAppealDetailsFromId(request.apiClient, request.params.appealId),
			usersService.getUserByRoleAndId(
				isInspector
					? config.referenceData.appeals.inspectorGroupId
					: config.referenceData.appeals.caseOfficerGroupId,
				request.session,
				assigneeId
			)
		]);

		if (appealDetails && assigneeId) {
			return response.render('appeals/appeal/confirm-assign-unassign-user.njk', {
				appeal: {
					id: appealDetails?.appealId,
					reference: appealDetails?.appealReference,
					shortReference: appealShortReference(appealDetails?.appealReference)
				},
				user,
				isInspector,
				errors,
				isUnassign
			});
		}

		return response.render('app/404.njk');
	} catch (error) {
		logger.error(error, error instanceof Error ? error.message : 'Something went wrong');

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignCaseOfficer = async (request, response) => {
	renderAssignUser(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignInspector = async (request, response) => {
	renderAssignUser(request, response, true);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {boolean} [isInspector]
 */
export const postAssignUser = async (request, response, isInspector = false) => {
	const { errors } = request;

	if (errors) {
		return renderAssignUser(request, response, isInspector);
	}

	try {
		const { searchTerm } = request.body;
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		const userGroupId = isInspector
			? config.referenceData.appeals.inspectorGroupId
			: config.referenceData.appeals.caseOfficerGroupId;
		const users = await usersService.getUsersByRole(userGroupId, request.session);
		const matchingUsers = users.filter(
			(user) =>
				user.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
				user.email?.toLowerCase().includes(lowerCaseSearchTerm)
		);

		return renderAssignUser(request, response, isInspector, matchingUsers);
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
 * @param {boolean} [isInspector]
 * @param {boolean} [isUnassign]
 */
export const postAssignOrUnassignUserCheckAndConfirm = async (
	request,
	response,
	isInspector = false,
	isUnassign = false
) => {
	const { errors } = request;

	if (errors) {
		return renderAssignOrUnassignUserCheckAndConfirm(request, response, isInspector, isUnassign);
	}

	try {
		const {
			body: { confirm },
			params: { appealId, assigneeId }
		} = request;

		if (confirm === 'yes') {
			await setAppealAssignee(
				request.apiClient,
				appealId,
				isUnassign ? null : assigneeId,
				isInspector
			);

			request.session[
				`${isInspector ? 'inspector' : 'caseOfficer'}${isUnassign ? 'Removed' : 'Added'}`
			] = true;

			return response.redirect(
				isUnassign
					? `/appeals-service/appeal-details/${appealId}/assign-new-user/${
							isInspector ? 'inspector' : 'case-officer'
					  }`
					: `/appeals-service/appeal-details/${appealId}/`
			);
		}

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/assign-user/${
				isInspector ? 'inspector' : 'case-officer'
			}`
		);
	} catch (error) {
		logger.error(error, error instanceof Error ? error.message : 'Something went wrong');

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignCaseOfficerCheckAndConfirm = async (request, response) => {
	renderAssignOrUnassignUserCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignInspectorCheckAndConfirm = async (request, response) => {
	renderAssignOrUnassignUserCheckAndConfirm(request, response, true);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignCaseOfficerCheckAndConfirm = async (request, response) => {
	postAssignOrUnassignUserCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignInspectorCheckAndConfirm = async (request, response) => {
	postAssignOrUnassignUserCheckAndConfirm(request, response, true);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getUnassignCaseOfficerCheckAndConfirm = async (request, response) => {
	renderAssignOrUnassignUserCheckAndConfirm(request, response, false, true);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getUnassignInspectorCheckAndConfirm = async (request, response) => {
	renderAssignOrUnassignUserCheckAndConfirm(request, response, true, true);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postUnassignCaseOfficerCheckAndConfirm = async (request, response) => {
	postAssignOrUnassignUserCheckAndConfirm(request, response, false, true);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postUnassignInspectorCheckAndConfirm = async (request, response) => {
	postAssignOrUnassignUserCheckAndConfirm(request, response, true, true);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {boolean} [isInspector]
 */
const renderAssignNewUser = async (request, response, isInspector = false) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		return response.render('appeals/appeal/assign-new-user.njk', {
			appeal: {
				id: appealDetails.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealShortReference(appealDetails?.appealReference)
			},
			isInspector,
			errors
		});
	}

	return response.render('app/404.njk');
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignNewCaseOfficer = async (request, response) => {
	renderAssignNewUser(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAssignNewInspector = async (request, response) => {
	renderAssignNewUser(request, response, true);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {boolean} [isInspector]
 */
export const postAssignNewUser = async (request, response, isInspector = false) => {
	const { errors } = request;

	if (errors) {
		return renderAssignNewUser(request, response, isInspector);
	}

	try {
		const {
			body: { confirm },
			params: { appealId }
		} = request;

		if (confirm === 'yes') {
			return response.redirect(
				`/appeals-service/appeal-details/${appealId}/assign-user/${
					isInspector ? 'inspector' : 'case-officer'
				}`
			);
		}

		return response.redirect(`/appeals-service/appeal-details/${appealId}/`);
	} catch (error) {
		logger.error(error, error instanceof Error ? error.message : 'Something went wrong');

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignNewCaseOfficer = async (request, response) => {
	postAssignNewUser(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const postAssignNewInspector = async (request, response) => {
	postAssignNewUser(request, response, true);
};
