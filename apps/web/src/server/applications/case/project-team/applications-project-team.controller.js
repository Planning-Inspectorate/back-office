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
 * @type {import('@pins/express').RenderHandler<{}, {}, {query: string}, {q: string, number: string}>}
 */
export async function viewProjectTeamSearchPage({ body, query, errors }, response) {
	const searchTerm = body.query?.length ? body.query : query.q;
	const pageNumber = Number(query.number || '1');

	const templateData = await searchProjectTeamMembersData(searchTerm, pageNumber, errors);

	return response.render(`applications/case-project-team/project-team-search.njk`, templateData);
}

/**
 * Search project team members and return results
 * @param {string} searchTerm
 * @param {number} pageNumber
 * @param {ValidationErrors | undefined} validationErrors
 */
async function searchProjectTeamMembersData(searchTerm, pageNumber, validationErrors) {
	let results;
	let errors = validationErrors;
	let paginationButtons;

	if (!validationErrors && searchTerm) {
		results = { items: [] };
		const { errors: apiErrors, results: apiResults } = await searchProjectTeamMembers(
			searchTerm,
			pageNumber
		);
		errors = apiErrors;

		if (apiResults) {
			results = apiResults;

			console.log(53, results);
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
	}

	return {
		results,
		errors,
		paginationButtons
	};
}
