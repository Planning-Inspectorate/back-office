import { eventClient } from './event-client.js';
import { buildNsipProjectPayload } from './payload-builders/nsip-project.js';
import { NSIP_PROJECT, NSIP_SUBSCRIPTION, SERVICE_USER } from './topics.js';
import { buildServiceUserPayload } from './payload-builders/service-user.js';
import { buildSubscriptionPayloads } from './payload-builders/subscriptions.js';
import { EventType } from '@pins/event-client';

const Applicant = 'Applicant';
const Subscriber = 'Subscriber';

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
			[buildServiceUserPayload(project.applicant, project.reference, Applicant)],
			eventType
		);
	}
};

/**
 * Broadcast events for an updated NSIP Subscription
 *
 * @param {import('@pins/applications.api').Schema.Subscription} subscription
 * @param {string} eventType
 */
export const broadcastNsipSubscriptionEvent = async (subscription, eventType) => {
	await eventClient.sendEvents(
		NSIP_SUBSCRIPTION,
		buildSubscriptionPayloads(subscription),
		eventType
	);

	// When creating a subscription, we broadcast a creation for the service user role assignment
	// This role assignment only happens once, because when the subscription is closed it just receives an end date
	// Even though a subscriber can have multiple subscriptions for a case (the types of updates they subscribe to), there's still only one 'role assignment' entity
	if (eventType === EventType.Create) {
		await eventClient.sendEvents(
			SERVICE_USER,
			[buildServiceUserPayload(subscription.subscriber, subscription.caseReference, Subscriber)],
			eventType
		);
	}
};
