import pino from '../../../lib/logger.js';
import { get, patch, post } from '../../../lib/request.js';
import { getProjectTeam } from '../../common/services/project-team.service.js';

/** @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth */
/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('../../applications.types').PaginatedResponse<Partial<ProjectTeamMember>>} PaginatedProjectTeamMembers */

/**
 * Retrieve the paginated list of the team members matching the query
 *
 * @param {string} searchTerm
 * @param {Partial<ProjectTeamMember>[]} allAzureUsers
 * @param {number} pageNumber
 * @returns {Promise<{results: PaginatedProjectTeamMembers}>}
 */
export const searchProjectTeamMembers = async (searchTerm, allAzureUsers, pageNumber) => {
	const searchResults = allAzureUsers.filter((azureUser) => {
		const { givenName, surname, userPrincipalName: email } = azureUser;

		// check whether the search matches partially the name, the surname or the email
		return (
			`${givenName || ''} ${surname || ''}`.toLocaleLowerCase().includes(searchTerm) ||
			`${surname || ''} ${givenName || ''}`.toLocaleLowerCase().includes(searchTerm) ||
			`${givenName || ''}`.toLocaleLowerCase().includes(searchTerm) ||
			`${surname || ''}`.toLocaleLowerCase().includes(searchTerm) ||
			`${email || ''}`.toLocaleLowerCase().includes(searchTerm)
		);
	});

	/** @type {PaginatedProjectTeamMembers} */
	const paginatedResults = {
		items: searchResults,
		page: pageNumber,
		pageSize: 25,
		pageDefaultSize: 25,
		itemCount: searchResults.length,
		pageCount: Math.ceil(searchResults.length / 25)
	};

	return { results: paginatedResults };
};

/**
 * Retrieve the case team members stored in the db
 *
 * @param {number} caseId
 * @returns {Promise<{projectTeamMembers?: {userId: string, role: string}[], errors?: {query: string}}>}
 */
export const getProjectTeamMembers = async (caseId) => {
	try {
		return { projectTeamMembers: await getProjectTeam(caseId) };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.error?.code || 'Unknown error'}`);

		return { errors: { query: 'An error occurred, please try again later' } };
	}
};

/**
 * Remove team member from project
 *
 * @param {number} caseId
 * @param {string} userId
 * @returns {Promise<{projectTeamMember?: {userId: string, role: string}, errors?: {msg: string}}>}
 */
export const removeProjectTeamMember = async (caseId, userId) => {
	try {
		const projectTeamMember = await post(`applications/${caseId}/project-team/remove-member`, {
			json: { userId }
		});
		return { projectTeamMember };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors || 'Unknown error'}`);

		return { errors: { msg: 'The team member could not be removed, try again.' } };
	}
};

/**
 * Retrieve the case team member info stored in the db having the given userid
 *
 * @param {number} caseId
 * @param {string} userId
 * @returns {Promise<{projectTeamMember?: {userId: string, role: string} , errors?: {query: string}}>}
 */
export const getProjectTeamMemberById = async (caseId, userId) => {
	try {
		const projectTeamMember = await get(`applications/${caseId}/project-team/${userId}`);

		return { projectTeamMember };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.error?.code || 'Unknown error'}`);

		return { errors: { query: 'An error occurred, please try again later' } };
	}
};

/**
 * Update the role of the case team member
 *
 * @param {number} caseId
 * @param {string} userId
 * @param {string} role
 * @returns {Promise<{projectTeamMember?: {userId: string, role: string} , errors?: {query: string}}>}
 */
export const updateProjectTeamMemberRole = async (caseId, userId, role) => {
	try {
		const projectTeamMember = await patch(`applications/${caseId}/project-team/${userId}`, {
			json: {
				role
			}
		});

		return { projectTeamMember };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors || 'Unknown error'}`);

		return { errors: { query: 'The role could not be saved, try again.' } };
	}
};
