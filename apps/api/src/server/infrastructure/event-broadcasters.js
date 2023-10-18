import { eventClient } from './event-client.js';
import { buildNsipProjectPayload } from './payload-builders/nsip-project.js';
import { NSIP_PROJECT, SERVICE_USER } from './topics.js';
import { buildServiceUserPayload } from './payload-builders/applicant.js';

const applicant = 'Applicant';

/**
 * Broadcast events for an updated NSIP Project entity.
 *
 * This will always publish an update/publish/un-publish to the associated Applicant entity.
 *
 * @param {import('@pins/applications.api').Schema.Case} project
 * @param {string} eventType
 */
export const broadcastNsipProjectEvent = async (project, eventType) => {
	await eventClient.sendEvents(NSIP_PROJECT, [buildNsipProjectPayload(project)], eventType);

	if (project.applicant && project.reference) {
		// We can't broadcast a service user until they have a role (i.e. there's a case reference)
		// This means that the consumers won't know about the applicant until the case creation has finished
		await eventClient.sendEvents(
			SERVICE_USER,
			[buildServiceUserPayload(project.applicant, project.reference, applicant)],
			eventType
		);
	}
};
