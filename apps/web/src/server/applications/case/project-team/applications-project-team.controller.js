import projectTeamADService from './application-project-team.azure-service.js';
import {
	getProjectTeamMemberById,
	getProjectTeamMembers,
	searchProjectTeamMembers,
	updateProjectTeamMemberRole
} from './applications-project-team.service.js';

/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth */

const allRoles = [
	{ value: 'case_manager', text: 'Case Manager' },
	{ value: 'environmental_services', text: 'Environmental Services' },
	{ value: 'inspector', text: 'Inspector' },
	{ value: 'lead_inspector', text: 'Lead Inspector' },
	{ value: 'legal_officer', text: 'Legal Officer' },
	{ value: 'NSIP_administration_officer', text: 'NSIP Administration Officer' },
	{ value: 'NSIP_officer', text: 'NSIP Officer' },
	{ value: 'officer', text: 'Officer' },
	{ value: 'operations_lead', text: 'Operations Lead' },
	{ value: 'operations_manager', text: 'Operations Manager' }
];

/**
 * View all the project team members
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export async function viewProjectTeamListPage({ session }, response) {
	const { caseId } = response.locals;

	// query the internal database to retrieve roles and ids
	const { projectTeamMembers } = await getProjectTeamMembers(caseId);

	// add users info from the cache containing the results of ms graph api query
	const projectTeamMembersInfo = await getManyProjectTeamMembersInfo(projectTeamMembers, session);

	return response.render(`applications/case-project-team/project-team-list.njk`, {
		selectedPageType: 'project-team',
		projectTeamMembers: projectTeamMembersInfo,
		allRoles
	});
}

/**
 * Page for choosing role of the project team member
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {userId: string}>}
 */
export async function viewProjectTeamChooseRolePage({ params, session }, response) {
	const { caseId } = response.locals;
	const { userId } = params;

	const projectTeamMember = await getSingleProjectTeamMemberInfo(caseId, userId, session);

	return response.render(`applications/case-project-team/project-team-choose-role.njk`, {
		projectTeamMember,
		allRoles
	});
}

/**
 * Update role of the project team member
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {role: string}, {}, {userId: string}>}
 */
export async function updateProjectTeamChooseRole({ params, session, body }, response) {
	const { caseId } = response.locals;
	const { userId } = params;
	const { role } = body;

	const { errors } = await updateProjectTeamMemberRole(caseId, userId, role);

	if (errors) {
		const projectTeamMember = await getSingleProjectTeamMemberInfo(caseId, userId, session);

		return response.render(`applications/case-project-team/project-team-choose-role.njk`, {
			projectTeamMember,
			allRoles,
			errors
		});
	}

	return response.redirect('../');
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

	// checkpoint 2: retrieve all azure users from cache or return 401
	const allAzureUsers = await projectTeamADService.getAllCachedUsers(session);

	// checkpoint 3: search member and render paginated list of results
	const searchResults = await searchProjectTeamMembersData(searchTerm, allAzureUsers, pageNumber);

	return response.render(template, searchResults);
}

/**
 * Search project team members and return results
 *
 * @param {string} searchTerm
 * @param {ProjectTeamMember[]} allAzureUsers
 * @param {number} pageNumber
 */
async function searchProjectTeamMembersData(searchTerm, allAzureUsers, pageNumber) {
	const { results } = await searchProjectTeamMembers(searchTerm, allAzureUsers, pageNumber);

	if (!results) {
		return {
			results: { items: [] },
			paginationButtons: null
		};
	}

	const paginationButtons = {
		...(pageNumber === 1
			? {}
			: { previous: { href: `?number=${pageNumber - 1}&q=${searchTerm}` } }),
		...(pageNumber === results.pageCount
			? {}
			: { next: { href: `?number=${pageNumber + 1}&q=${searchTerm}` } }),
		items: [...Array.from({ length: results.pageCount || 0 }).keys()].map((index) => ({
			number: index + 1,
			href: `?number=${index + 1}&q=${searchTerm}`,
			current: index + 1 === pageNumber
		}))
	};

	return {
		results,
		paginationButtons
	};
}

/**
 * Add extra info (name and email) to the internally stored data of team members (id and role)
 *
 * @param {{userId: string, role: string}[]} projectTeamMembers
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
const getManyProjectTeamMembersInfo = async (projectTeamMembers, session) => {
	// retrieve all the AD users or throw error
	// this list contains extra info such as names or emails
	const allAzureUsers = await projectTeamADService.getAllCachedUsers(session);

	// merge the info retrieved from Azure to the internally stored data
	const projectTeamMembersInfo = projectTeamMembers.map((teamMember) => {
		const teamMemberInfo = allAzureUsers.find((azureUser) => azureUser.id === teamMember.userId);

		return {
			...teamMember,
			...teamMemberInfo
		};
	});

	return projectTeamMembersInfo;
};

/**
 * Add extra info (name and email) to the internally stored data of team members (id and role)
 *
 * @param {number} caseId
 * @param {string} userId
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>>}
 */
const getSingleProjectTeamMemberInfo = async (caseId, userId, session) => {
	let role = '';

	// check if user alreay belong to the project
	// if yes => show existing role and update
	// if no => show all options blank and add new user
	const { projectTeamMember, errors } = await getProjectTeamMemberById(caseId, userId);

	if (!errors) {
		// if the api request has no errors, it means that the user already belongs to the project
		// display the radio options with the preselected role
		role = projectTeamMember.role;
	}

	const projectTeamMemberInfo = await getManyProjectTeamMembersInfo([{ userId, role }], session);

	return projectTeamMemberInfo[0];
};
