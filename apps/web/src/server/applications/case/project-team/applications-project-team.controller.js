import projectTeamADService from './application-project-team.azure-service.js';
import {
	destroySuccessBanner,
	getSuccessBanner,
	setSuccessBanner
} from '../../../applications/common/services/session.service.js';
import {
	getManyProjectTeamMembersInfo,
	getProjectTeamMemberById,
	getProjectTeamMembers,
	removeProjectTeamMember,
	searchProjectTeamMembers,
	updateProjectTeamMemberRole
} from './applications-project-team.service.js';

/** @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember */
/** @typedef {import('@pins/express').ValidationErrors} ValidationErrors */
/** @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth */

export const allRoles = [
	{ value: 'case_manager', text: 'Case Manager', unique: true },
	{ value: 'environmental_services', text: 'Environmental Services', unique: true },
	{ value: 'inspector', text: 'Inspector', unique: false },
	{ value: 'lead_inspector', text: 'Lead Inspector', unique: true },
	{ value: 'legal_officer', text: 'Legal Officer', unique: true },
	{ value: 'NSIP_administration_officer', text: 'NSIP Administration Officer', unique: false },
	{ value: 'NSIP_officer', text: 'NSIP Officer', unique: false },
	{ value: 'officer', text: 'Officer', unique: false },
	{ value: 'operations_lead', text: 'Operations Lead', unique: true },
	{ value: 'operations_manager', text: 'Operations Manager', unique: true }
];

/**
 * Returns available roles.
 *
 * Available roles include:
 * - The role already assigned to the team member
 * - The roles that can be assigned to multiple team members
 * - The unassigned roles that cannot be assigned to multiple team members
 *
 * @param {Partial<ProjectTeamMember>} projectTeamMember
 * @param {Partial<ProjectTeamMember>[]} projectTeamMembers
 */
function availableRoles(projectTeamMember, projectTeamMembers) {
	const rolesAvailable = [projectTeamMember.role];

	allRoles.forEach(({ value, unique }) => {
		if (!unique || !projectTeamMembers.some((member) => member.role === value)) {
			if (!rolesAvailable.includes(value)) {
				rolesAvailable.push(value);
			}
		}
	});

	return allRoles.filter(({ value }) => rolesAvailable.includes(value));
}

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
	const projectTeamMembersInfo = await getManyProjectTeamMembersInfo(
		projectTeamMembers || [],
		session
	);

	const showSuccessBanner = getSuccessBanner(session);
	destroySuccessBanner(session);

	return response.render(`applications/case-project-team/project-team-list.njk`, {
		selectedPageType: 'project-team',
		projectTeamMembers: projectTeamMembersInfo,
		allRoles,
		showSuccessBanner
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

	const { projectTeamMembers = [] } = await getProjectTeamMembers(caseId);

	const projectTeamMember = await getSingleProjectTeamMemberInfo(caseId, userId, session);

	return response.render(`applications/case-project-team/project-team-choose-role.njk`, {
		projectTeamMember,
		availableRoles: availableRoles(projectTeamMember, projectTeamMembers)
	});
}

/**
 * Page for removing team member from project
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {userId: string}>}
 */
export async function viewProjectTeamRemovePage({ params, session }, response) {
	const { caseId } = response.locals;
	const { userId } = params;

	const projectTeamMember = await getSingleProjectTeamMemberInfo(caseId, userId, session);

	return response.render(`applications/case-project-team/project-team-remove.njk`, {
		projectTeamMember
	});
}

/**
 * Execute removal of team member from project
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {userId: string}>}
 */
export async function updateProjectTeamRemove({ params, session }, response) {
	const { caseId } = response.locals;
	const { userId } = params;

	const { errors } = await removeProjectTeamMember(caseId, userId);

	if (errors) {
		const projectTeamMember = await getSingleProjectTeamMemberInfo(caseId, userId, session);

		return response.render(`applications/case-project-team/project-team-remove.njk`, {
			projectTeamMember,
			errors
		});
	}

	setSuccessBanner(session);

	return response.redirect('../');
}

/**
 * Update role of the project team member
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {role: string}, {toSearchPage: string}, {userId: string}>}
 */
export async function updateProjectTeamChooseRole(
	{ query, params, session, body, errors: validationErrors },
	response
) {
	const { caseId } = response.locals;
	const { userId } = params;
	const { role } = body;
	const { toSearchPage } = query;
	let apiErrors = null;

	if (!validationErrors) {
		const { errors } = await updateProjectTeamMemberRole(caseId, userId, role);
		apiErrors = errors;
	}

	if (validationErrors || apiErrors) {
		const { projectTeamMembers = [] } = await getProjectTeamMembers(caseId);
		const projectTeamMember = await getSingleProjectTeamMemberInfo(caseId, userId, session);

		return response.render(`applications/case-project-team/project-team-choose-role.njk`, {
			projectTeamMember,
			availableRoles: availableRoles(projectTeamMember, projectTeamMembers),
			errors: validationErrors || apiErrors
		});
	}

	if (toSearchPage) {
		return response.redirect('../search');
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
	const { caseId } = response.locals;

	// checkpoint 1: render empty search page when query not valid or empty
	if (validationErrors || !searchTerm) {
		return response.render(template, { errors: validationErrors });
	}

	// checkpoint 2: retrieve all azure users from cache or return 401
	const allAzureUsers = await projectTeamADService.getAllCachedUsers(session);

	// checkpoint 3: search member and render paginated list of results
	const searchResults = await searchProjectTeamMembersData(
		searchTerm,
		allAzureUsers,
		pageNumber,
		caseId
	);

	return response.render(template, searchResults);
}

/**
 * Search project team members and return results
 *
 * @param {string} searchTerm
 * @param {Partial<ProjectTeamMember>[]} allAzureUsers
 * @param {number} pageNumber
 * @param {number} caseId
 */
async function searchProjectTeamMembersData(searchTerm, allAzureUsers, pageNumber, caseId) {
	// perform search looking inside the cached users
	const { results } = await searchProjectTeamMembers(
		searchTerm.toLocaleLowerCase(),
		allAzureUsers,
		pageNumber
	);

	if (!results) {
		return {
			results: { items: [] },
			paginationButtons: null
		};
	}

	// query the internal database to retrieve roles and ids
	const { projectTeamMembers } = await getProjectTeamMembers(caseId);

	// add the label "isAdded" if a result item has been already added to the project
	results.items = results.items.map((resultItem) => {
		const isAlreadyAdded = (projectTeamMembers || []).find(
			(existingMember) => existingMember.userId === resultItem.id
		);
		if (isAlreadyAdded) {
			return { ...resultItem, isAdded: true };
		}
		return resultItem;
	});

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
 * @param {number} caseId
 * @param {string} userId
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>>}
 */
const getSingleProjectTeamMemberInfo = async (caseId, userId, session) => {
	let role = '';

	// check if user alreay belongs to the project
	// if yes => show existing role and update
	// if no => show all options blank and add new user
	const { projectTeamMember, errors } = await getProjectTeamMemberById(caseId, userId);

	if (!errors && projectTeamMember) {
		// if the api request has no errors, it means that the user already belongs to the project
		// display the radio options with the preselected role
		role = projectTeamMember.role;
	}

	const projectTeamMemberInfo = await getManyProjectTeamMembersInfo([{ userId, role }], session);

	return projectTeamMemberInfo[0];
};
