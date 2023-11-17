import * as projectTeamRepository from '#repositories/project-team.repository.js';
import BackOfficeAppError from '#utils/app-error.js';
import { mapProjectTeamMember, mapProjectTeamMembers } from '#utils/mapping/map-project-team.js';

/**
 * @type {import('express').RequestHandler}
 */
export const getProjectTeamMembers = async ({ params }, response) => {
	const { id } = params;

	const projectTeamMembers = await projectTeamRepository.getByCaseId(Number(id));

	response.send(mapProjectTeamMembers(projectTeamMembers));
};

/**
 * @type {import('express').RequestHandler}
 */
export const getProjectTeamMemberById = async ({ params }, response) => {
	const { id, userId } = params;

	const projectTeamMember = await projectTeamRepository.getByUserIdRelatedToCaseId(
		userId,
		Number(id)
	);

	if (!projectTeamMember) {
		throw new BackOfficeAppError(
			`No project team member found with id ${userId} for the case ${id}`,
			404
		);
	}

	response.send(mapProjectTeamMember(projectTeamMember));
};

/**
 * @type {import('express').RequestHandler}
 */
export const updateProjectTeamMemberRole = async ({ params, body }, response) => {
	const { id, userId } = params;
	const { role } = body;

	const projectTeamMember = await projectTeamRepository.upsert(userId, Number(id), role);

	if (!projectTeamMember) {
		throw new BackOfficeAppError(
			`An error occured member during the upsert of user id ${userId} for the case ${id}`,
			500
		);
	}

	response.send(mapProjectTeamMember(projectTeamMember));
};
