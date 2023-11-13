import pino from '../../../lib/logger.js';
import projectTeamADService from './application-project-team.azure-service.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('../../applications.types').PaginatedResponse<ProjectTeamMember>} PaginatedProjectTeamMembers */

/**
 * Retrieve the paginated list of the team members matching the query
 *
 * @param {string} searchTerm
 * @param {string} ADToken
 * @param {number} pageNumber
 * @returns {Promise<{results: PaginatedProjectTeamMembers, errors: ValidationErrors}>}
 */
export const searchProjectTeamMembers = async (searchTerm, ADToken, pageNumber) => {
	let response;

	try {
		const searchResults = await projectTeamADService.searchADMember(searchTerm, ADToken);

		/** @type {PaginatedProjectTeamMembers} */
		const paginatedResults = {
			items: searchResults,
			page: pageNumber,
			pageSize: 25,
			pageDefaultSize: 25,
			itemCount: searchResults.length,
			pageCount: Math.ceil(searchResults.length / 25)
		};

		response = { results: paginatedResults };
	} catch (/** @type {*} */ error) {
		pino.error(`[GRAPH MICROSOFT API] ${error?.response?.body?.error?.code || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { query: 'An error occurred, please try again later' } });
		});
	}

	return response;
};
