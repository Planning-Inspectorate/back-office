import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import { getUsersByRole, getUserByRoleAndId } from '../../appeal-users/users-service.js';
import config from '#environment/config.js';
import { setAppealAssignee } from './assign-user.service.js';
import { mapAssignedUserToSummaryListBuilderParameters } from './assign-user.mapper.js';
import { generateSummaryList } from '#lib/nunjucks-template-builders/summary-list-builder.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {boolean} isInspector
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

		const currentlyAssignedUser = await mapAssignedUserToSummaryListBuilderParameters(
			appealDetails[isInspector ? 'inspector' : 'caseOfficer'],
			appealDetails.appealId,
			isInspector
				? config.referenceData.appeals.inspectorGroupId
				: config.referenceData.appeals.caseOfficerGroupId,
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
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			isInspector,
			currentAssignee,
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
const renderAssignOrUnassignUserCheckAndConfirm = async (
	request,
	response,
	isInspector = false,
	isUnassign = false
) => {
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

			return response.render('appeals/appeal/confirm-assign-unassign-user.njk', {
				appeal: {
					id: appealDetails?.appealId,
					reference: appealDetails?.appealReference,
					shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
				},
				user,
				isInspector,
				errors,
				isUnassign
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
	renderAssignUser(request, response, true);
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

		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(request.apiClient, request.params.appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			if (confirm === 'yes') {
				await setAppealAssignee(
					request.apiClient,
					appealId,
					isUnassign ? '' : assigneeId,
					isInspector
				);

				request.session.assignedUserChanged = { isInspector, isUnassign };

				return response.redirect(`/appeals-service/appeal-details/${appealId}/`);
			}

			return response.redirect(
				`/appeals-service/appeal-details/${appealId}/${isUnassign ? 'unassign' : 'assign'}-user/${
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
