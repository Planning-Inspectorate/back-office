import * as projectTeamRepository from '#repositories/project-team.repository.js';
import BackOfficeAppError from '#utils/app-error.js';
import { mapProjectTeamMember, mapProjectTeamMembers } from '#utils/mapping/map-project-team.js';
import * as caseRepository from '#repositories/case.repository.js';
import { broadcastNsipProjectEvent } from '#infrastructure/event-broadcasters.js';
import { EventType } from '@pins/event-client';

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

	const project = await caseRepository.getById(id, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		projectTeam: true,
		gridReference: true
	});

	if (!projectTeamMember || !project) {
		throw new BackOfficeAppError(
			`An error occured during the upsert of user id ${userId} for the case ${id}`,
			500
		);
	}
	await broadcastNsipProjectEvent(project, EventType.Update);

	response.send(mapProjectTeamMember(projectTeamMember));
};

/**
 * @type {import('express').RequestHandler}
 */
export const removeProjectTeamMember = async ({ params, body }, response) => {
	const { id } = params;
	const { userId } = body;

	const project = await caseRepository.getById(id, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		gridReference: true,
		projectTeam: true
	});

	if (!project) {
		throw new BackOfficeAppError(`Error while removing user ${userId} for the case ${id}`, 500);
	}

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

	try {
		await projectTeamRepository.remove(userId, Number(id));

		project.ProjectTeam = project.ProjectTeam.filter((member) => member.userId !== userId);
		await broadcastNsipProjectEvent(project, EventType.Update);

		response.send(projectTeamMember);
	} catch {
		throw new BackOfficeAppError(`Error while removing user ${userId} for the case ${id}`, 500);
	}
};
