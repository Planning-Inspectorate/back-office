import pino from '../../../lib/logger.js';
import { get } from '../../../lib/request.js';
import projectADService from './azure-project-team.js';

/**
 * @typedef {import('../../applications.types').ProjectTeamMember} ProjectTeamMember
 * @typedef {import("../../../app/auth/auth-session.service.js").SessionWithAuth} SessionWithAuth
 */

/**
 * @param {number} caseId
 * @returns {Promise<{ userId: string, role: string }[]>}
 * @throws {Error}
 * */
export const getProjectTeam = async (caseId) => {
	try {
		return await get(`applications/${caseId}/project-team`);
	} catch (/** @type {*} */ error) {
		pino.error(
			`[WEB] GET /applications-service/case/${caseId}/project-team (Response code: ${error?.response?.statusCode})`
		);
		throw new Error(error?.response.statusCode);
	}
};

/**
 * Add extra info (name and email) to the internally stored data of team members (id and role)
 *
 * @param {{userId: string, role: string}[]} projectTeamMembers
 * @param {SessionWithAuth} session
 * @returns {Promise<Partial<ProjectTeamMember>[]>}
 */
export const getManyProjectTeamMembersInfo = async (projectTeamMembers, session) => {
	// retrieve all the AD users or throw error
	// this list contains extra info such as names or emails
	const allAzureUsers = await projectADService.getAllCachedUsers(session);

	// if for some reason no user can be retrieved from Azure, just return an empty array
	if (allAzureUsers.length === 0) {
		return [];
	}

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
