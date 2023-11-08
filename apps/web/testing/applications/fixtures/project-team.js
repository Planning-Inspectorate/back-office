import { createProjectTeamMember } from '../factory/project-team.js';

/**
 * @typedef {import('../../../src/server/applications/applications.types').ProjectTeamMember} ProjectTeamMember
 * @typedef {import('../../../src/server/applications/applications.types').PaginatedResponse<ProjectTeamMember>} PaginatedProjectTeamMembers
 * /

/**
 *
 * @type {ProjectTeamMember[]}
 */
export const fixtureProjectTeamMembers = [...Array.from({ length: 200 }).keys()].map((id) =>
	createProjectTeamMember({ id: `${id + 1}` })
);

/**
 *
 * @param {number} page
 * @param {number} pageDefaultSize
 * @returns {PaginatedProjectTeamMembers}
 */
export const fixturePaginatedProjectTeamMembers = (page, pageDefaultSize) => ({
	page,
	pageSize: pageDefaultSize,
	pageDefaultSize,
	pageCount: Math.ceil(200 / pageDefaultSize),
	itemCount: 200,
	items: fixtureProjectTeamMembers.slice(
		(page - 1) * pageDefaultSize,
		pageDefaultSize + (page - 1) * pageDefaultSize
	)
});
