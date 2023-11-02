import { fixturePaginatedProjectTeamMembers } from '../../../../../testing/applications/fixtures/project-team.js';
import pino from '../../../lib/logger.js';

/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('../../applications.types').PaginatedResponse<ProjectTeamMember>} PaginatedProjectTeamMembers */

/**
 * Retrieve the paginated list of the team members matching the query
 *
 * @param {string} query
 * @param {number} pageNumber
 * @returns {Promise<{results: PaginatedProjectTeamMembers, errors: ValidationErrors}>}
 */
export const searchProjectTeamMembers = async (query, pageNumber) => {
	let response;

	try {
		//response = await get(`applications/${caseId}/key-dates`);

		// TODO: this is just a mock
		response = new Promise((resolve) => {
			const results = fixturePaginatedProjectTeamMembers(pageNumber, 25);
			resolve({ results, query });
		});
	} catch (/** @type {*} */ error) {
		pino.error(`[API] ${error?.response?.body?.errors?.message || 'Unknown error'}`);

		response = new Promise((resolve) => {
			resolve({ errors: { query: 'An error occurred, please try again later' } });
		});
	}

	return response;
};
