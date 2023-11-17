import { pick } from 'lodash-es';

/**
 *
 * @param {import('@pins/applications.api').Schema.ProjectTeam} teamMember
 * @returns {{role: string, userId: string}}
 */
export const mapProjectTeamMember = (teamMember) => {
	return pick(teamMember, ['role', 'userId', 'createdAt']);
};

/**
 *
 * @param {import('@pins/applications.api').Schema.ProjectTeam[]} teamMembers
 * @returns {{role: string, userId: string}[]}
 */
export const mapProjectTeamMembers = (teamMembers) => {
	return teamMembers?.map((teamMember) => mapProjectTeamMember(teamMember));
};
