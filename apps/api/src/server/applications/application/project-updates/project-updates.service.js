import { EventType } from '@pins/event-client';
import { eventClient } from '../../../infrastructure/event-client.js';
import {
	createProjectUpdate,
	deleteProjectUpdate,
	getProjectUpdate,
	updateProjectUpdate
} from '#repositories/project-update.respository.js';
import {
	buildProjectUpdatePayload,
	mapProjectUpdate,
	projectUpdateCreateReq,
	projectUpdateUpdateReq
} from '#infrastructure/payload-builders/nsip-project-update.js';
import { NSIP_PROJECT_UPDATE } from '#infrastructure/topics.js';
import BackOfficeAppError from '#utils/app-error.js';
import logger from '../../../utils/logger.js';
import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { verifyNotTraining } from '../application.validators.js';

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
	if (!created.case?.reference) {
		logger.warn('createProjectUpdateService: project update case has no reference. No event sent.');
		return mapProjectUpdate(created);
	}

	try {
		await verifyNotTraining(caseId);

		await eventClient.sendEvents(
			NSIP_PROJECT_UPDATE,
			[buildProjectUpdatePayload(created, created.case.reference)],
			EventType.Create
		);
	} catch (/** @type {*} */ err) {
		logger.error({ error: err.message }, 'Blocked sending event for project update');
	}

	return mapProjectUpdate(created);
}

/**
 * Update a project update, and send the Update event
 *
 * @param {*} body
 * @param {number} projectUpdateId
 * @param {boolean} shouldFinalise
 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
 */
export async function updateProjectUpdateService(body, projectUpdateId, shouldFinalise = false) {
	const updateReq = projectUpdateUpdateReq(body);

	const initialUpdate = await getProjectUpdate(projectUpdateId);
	if (!initialUpdate) {
		throw new BackOfficeAppError(`Project update with ID ${projectUpdateId} does not exist.`, 404);
	}

	const update = await updateProjectUpdate(projectUpdateId, updateReq);
	if (!update.case?.reference) {
		logger.warn(
			'updateProjectUpdateService: project update case has no reference. No event(s) sent.'
		);

		return mapProjectUpdate(update);
	}

	try {
		await verifyNotTraining(update.caseId);

		await eventClient.sendEvents(
			NSIP_PROJECT_UPDATE,
			[buildProjectUpdatePayload(update, update.case.reference)],
			statusToEventType(update.status, shouldFinalise)
		);
	} catch (/** @type {*} */ err) {
		logger.error({ error: err.message }, 'Blocked sending event for project update');
	}

	return mapProjectUpdate(update);
}

/**
 * Finalise a project update, and send the Publish/Unpublish event
 *
 * @param {number} projectUpdateId
 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
 */
export async function finaliseProjectUpdateService(projectUpdateId) {
	const initialUpdate = await getProjectUpdate(projectUpdateId, { case: true });
	if (!initialUpdate) {
		throw new BackOfficeAppError(`Project update with ID ${projectUpdateId} does not exist.`, 404);
	}

	const updateReq = {};
	switch (initialUpdate.status) {
		case ProjectUpdate.Status.readyToPublish:
			updateReq.status = ProjectUpdate.Status.published;
			updateReq.datePublished = new Date();
			break;
		case ProjectUpdate.Status.readyToUnpublish:
			updateReq.status = ProjectUpdate.Status.unpublished;
			break;
		default:
			throw BackOfficeAppError(
				`Project update with ID ${projectUpdateId} has invalid status ${initialUpdate.status}.`,
				409
			);
	}

	const update = await updateProjectUpdate(projectUpdateId, updateReq);
	if (!update.case?.reference) {
		logger.warn(
			'updateProjectUpdateService: project update case has no reference. No event(s) sent.'
		);

		return mapProjectUpdate(update);
	}

	try {
		await verifyNotTraining(update.caseId);

		await eventClient.sendEvents(
			NSIP_PROJECT_UPDATE,
			[buildProjectUpdatePayload(update, update.case.reference)],
			statusToEventType(update.status, true)
		);
	} catch (/** @type {*} */ err) {
		logger.error({ error: err.message }, 'Blocked sending event for project update');
	}

	return mapProjectUpdate(update);
}

/**
 * Delete a project update, and send the Delete event
 *
 * @param {number} projectUpdateId
 * @returns {Promise<void>}
 */
export async function deleteProjectUpdateService(projectUpdateId) {
	const deleted = await deleteProjectUpdate(projectUpdateId);
	if (!deleted.case?.reference) {
		logger.warn(
			'deleteProjectUpdateService: project update case has no reference. No event(s) sent.'
		);

		return;
	}

	try {
		await verifyNotTraining(deleted.caseId);

		await eventClient.sendEvents(
			NSIP_PROJECT_UPDATE,
			[buildProjectUpdatePayload(deleted, deleted.case.reference)],
			EventType.Delete
		);
	} catch (/** @type {*} */ err) {
		logger.error({ error: err.message }, 'Blocked sending event for project update');
	}
}

/**
 * Returns the EventType that should be emitted for the given status.
 *
 * @param {string} status
 * @param {boolean} shouldFinalise
 * @returns {string}
 */
function statusToEventType(status, shouldFinalise) {
	if (!shouldFinalise) {
		return EventType.Update;
	}
	switch (status) {
		case ProjectUpdate.Status.published:
			return EventType.Publish;
		case ProjectUpdate.Status.unpublished:
			return EventType.Unpublish;
	}
}
