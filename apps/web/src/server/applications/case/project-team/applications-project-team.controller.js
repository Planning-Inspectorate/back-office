import projectTeamADService from './application-project-team.azure-service.js';
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
 * View search bar for project team members and display results
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {query: string}, {q: string, number: string}>}
 */
export async function viewProjectTeamSearchPage(
	{ body, query, errors: validationErrors, session },
	response
) {
	const template = `applications/case-project-team/project-team-search`;
	const searchTerm = body.query?.length ? body.query : query.q;
	const pageNumber = Number(query.number || '1');

	// checkpoint 1: render empty search page when query not valid or empty
	if (validationErrors || !searchTerm) {
		return response.render(template, { errors: validationErrors });
	}

	// checkpoint 2: render empty search page when AD token is not found
	const { errors: authErrors, token } = await projectTeamADService.getTokenOrAuthErrors(session);

	if (authErrors || !token) {
		return response.render(template, { errors: authErrors });
	}

	// checkpoint 3: search member and render paginated list of results
	const searchResults = await searchProjectTeamMembersData(searchTerm, token, pageNumber);

	return response.render(template, searchResults);
}

/**
 * Search project team members and return results
 *
 * @param {string} searchTerm
 * @param {string} token
 * @param {number} pageNumber
 */
async function searchProjectTeamMembersData(searchTerm, token, pageNumber) {
	let paginationButtons;

	/** @type {{items: ProjectTeamMember[]}} */
	let results = { items: [] };

	const { errors, results: apiResults } = await searchProjectTeamMembers(
		searchTerm,
		token,
		pageNumber
	);

	if (apiResults) {
		results = apiResults;

		paginationButtons = {
			...(pageNumber === 1
				? {}
				: { previous: { href: `?number=${pageNumber - 1}&q=${searchTerm}` } }),
			...(pageNumber === apiResults.pageCount
				? {}
				: { next: { href: `?number=${pageNumber + 1}&q=${searchTerm}` } }),
			items: [...Array.from({ length: apiResults.pageCount || 0 }).keys()].map((index) => ({
				number: index + 1,
				href: `?number=${index + 1}&q=${searchTerm}`,
				current: index + 1 === pageNumber
			}))
		};
	}

	return {
		results,
		errors,
		paginationButtons
	};
}
