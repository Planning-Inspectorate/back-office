import pino from '../../../lib/logger.js';
import { get, patch } from '../../../lib/request.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('../../applications.types').PaginatedResponse<ProjectTeamMember>} PaginatedProjectTeamMembers */

/**
 * Retrieve the paginated list of the team members matching the query
 *
 * @param {string} searchTerm
 * @param {ProjectTeamMember[]} allAzureUsers
 * @param {number} pageNumber
 * @returns {Promise<{results: PaginatedProjectTeamMembers}>}
 */
export const searchProjectTeamMembers = async (searchTerm, allAzureUsers, pageNumber) => {
	const searchResults = allAzureUsers.filter((azureUser) => {
		const { givenName, surname, userPrincipalName: email } = azureUser;

		const recordString = (
			(givenName || '') +
			' ' +
			(surname || '') +
			' ' +
			(email || '')
		).toLocaleLowerCase();

		return recordString.includes(searchTerm);
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
 * @returns {Promise<{projectTeamMembers: {userId: string, role: string}[], errors: ValidationErrors}>}
 */
export const getProjectTeamMembers = async (caseId) => {
	let response;

	try {
		response = { projectTeamMembers: await get(`applications/${caseId}/project-team`) };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.error?.code || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { query: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Retrieve the case team member info stored in the db having the given userid
 *
 * @param {number} caseId
 * @param {string} userId
 * @returns {Promise<{projectTeamMember: {userId: string, role: string} , errors: ValidationErrors}>}
 */
export const getProjectTeamMemberById = async (caseId, userId) => {
	let response;

	try {
		const projectTeamMember = await get(`applications/${caseId}/project-team/${userId}`);

		response = { projectTeamMember };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.error?.code || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { query: 'An error occurred, please try again later' } });
		});
	}

	return response;
};

/**
 * Update the role of the case team member
 *
 * @param {number} caseId
 * @param {string} userId
 * @param {string} role
 * @returns {Promise<{projectTeamMember: {userId: string, role: string} , errors: ValidationErrors}>}
 */
export const updateProjectTeamMemberRole = async (caseId, userId, role) => {
	let response;

	try {
		const projectTeamMember = await patch(`applications/${caseId}/project-team/${userId}`, {
			json: {
				role
			}
		});

		response = { projectTeamMember };
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.error?.code || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { query: 'An error occurred, please try again later' } });
		});
	}

	return response;
};
