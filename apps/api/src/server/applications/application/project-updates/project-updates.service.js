import { EventType } from '@pins/event-client';
import { eventClient } from '../../../infrastructure/event-client.js';
import {
	createProjectUpdate,
	updateProjectUpdate
} from '../../../repositories/project-update.respository.js';
import {
	buildProjectUpdatePayload,
	mapProjectUpdate,
	projectUpdateCreateReq,
	projectUpdateUpdateReq
} from './project-updates.mapper.js';
import { NSIP_PROJECT_UPDATE } from '../../../infrastructure/topics.js';
import logger from '../../../utils/logger.js';
import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';

/**
 * Create a new project update, and send the Create event
 *
 * @param {*} body
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
 */
export async function createProjectUpdateService(body, caseId) {
	// request already validated, but we need to map it to a create request
	// this links to the case, and avoids extra fields being added
	const createReq = projectUpdateCreateReq(body, caseId);

	const created = await createProjectUpdate(createReq);

	if (created.case && created.case.reference) {
		await eventClient.sendEvents(
			NSIP_PROJECT_UPDATE,
			[buildProjectUpdatePayload(created, created.case.reference)],
			EventType.Create
		);
	} else {
		logger.warn('createProjectUpdateService: project update case has no reference. No event sent.');
	}

	return mapProjectUpdate(created);
}

/**
 * Update a project update, and send the Update event
 *
 * @param {*} body
 * @param {number} projectUpdateId
 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
 */
export async function updateProjectUpdateService(body, projectUpdateId) {
	const updateReq = projectUpdateUpdateReq(body);

	const update = await updateProjectUpdate(projectUpdateId, updateReq);

	if (update.case && update.case.reference) {
		const eventType = statusToEventType(update.status);
		const events = [buildProjectUpdatePayload(update, update.case.reference)];
		await eventClient.sendEvents(NSIP_PROJECT_UPDATE, events, eventType);
	} else {
		logger.warn(
			'updateProjectUpdateService: project update case has no reference. No event(s) sent.'
		);
	}

	return mapProjectUpdate(update);
}

/**
 * Returns the EventType that should be emitted for the given status.
 *
 * @param {string} status
 * @returns {string}
 */
function statusToEventType(status) {
	switch (status) {
		case ProjectUpdate.Status.published:
			return EventType.Publish;
		case ProjectUpdate.Status.unpublished:
			return EventType.Unpublish;
	}
	return EventType.Update;
}
