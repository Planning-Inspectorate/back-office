import { paginationParams } from '../../../lib/pagination-params.js';
import { searchProjectTeamMembers } from './applications-project-team.service.js';

/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */

/**
 * View all the project team member
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewProjectTeamListPage(request, response) {
	return response.render(`applications/case-project-team/project-team-list.njk`, {
		selectedPageType: 'project-team'
	});
}

/**
 * View search bar for project team members
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewProjectTeamSearchPage(request, response) {
	return response.render(`applications/case-project-team/project-team-search.njk`);
}

/**
 * Search project team members and return results
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {query: string}, {number: string}, {}>}
 */
export async function searchProjectTeamMembersPage(
	{ query, body, errors: validationErrors },
	response
) {
	/** @type{{items:ProjectTeamMember[]}} */
	let results = { items: [] };
	let errors = validationErrors;
	const pageNumber = Number(query.number || '1');
	let paginationButtons;

	if (!validationErrors) {
		const { errors: apiErrors, results: apiResults } = await searchProjectTeamMembers(body.query);
		errors = apiErrors;

		if (apiResults) {
			results = apiResults;
			paginationButtons = paginationParams(25, pageNumber, apiResults.pageCount).buttons;
			console.log(paginationButtons);
		}
	}

	return response.render(`applications/case-project-team/project-team-search.njk`, {
		results,
		errors,
		paginationButtons
	});
}
