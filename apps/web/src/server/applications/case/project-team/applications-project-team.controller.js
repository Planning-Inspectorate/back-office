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
	return response.render(`applications/case-project-team/project-team-search.njk`, {});
}
