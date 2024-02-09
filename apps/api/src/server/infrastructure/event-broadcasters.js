import logger from '#utils/logger.js';
import { eventClient } from './event-client.js';
import { buildNsipProjectPayload } from './payload-builders/nsip-project.js';
import { FOLDER, NSIP_PROJECT, SERVICE_USER } from './topics.js';
import { buildServiceUserPayload } from './payload-builders/applicant.js';
import { verifyNotTraining } from '../applications/application/application.validators.js';
import { EventType } from '@pins/event-client';
import { getAllByCaseId } from '#repositories/folder.repository.js';
import { buildFoldersPayload } from '#infrastructure/payload-builders/folder.js';

const applicant = 'Applicant';

/**
 * Broadcast events for an updated NSIP Project entity.
 *
 * This will always publish an update/publish/un-publish to the associated Applicant entity.
 * If we are starting a case, broadcast the folders create event.
 *
 * @param {import('@pins/applications.api').Schema.Case} project
 * @param {string} eventType
 * @param {boolean} [isCaseStart]
 */
export const broadcastNsipProjectEvent = async (project, eventType, isCaseStart = false) => {
	try {
		await verifyNotTraining(project.id);
	} catch (/** @type {*} */ err) {
		logger.info('Aborted broadcasting event for project:', err.message);
		return;
	}

	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(project)], eventType);

	if (project.applicant && project.reference) {
		// We can't broadcast a service user until they have a role (i.e. there's a case reference)
		// This means that the consumers won't know about the applicant until the case creation has finished
		await eventClient.sendEvents(
			SERVICE_USER,
			[buildServiceUserPayload(project.applicant, project.reference, applicant)],
			eventType,
			{ entityType: applicant }
		);
	}

	if (isCaseStart) {
		// We can safely call get all by case as it will only be the folders we have created.
		const caseFolders = await getAllByCaseId(project.id);
		await eventClient.sendEvents(
			FOLDER,
			buildFoldersPayload(caseFolders, project.reference),
			EventType.Create
		);
	}
};
