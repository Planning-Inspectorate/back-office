import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_SUBSCRIPTION } from '#infrastructure/topics.js';
import * as subscriptionRepository from '#repositories/subscription.respository.js';
import * as serviceUserRepository from '#repositories/service-user.repository.js';
import {
	subscriptionTypeChanges,
	typesToSubscription
} from '#infrastructure/payload-builders/subscriptions.js';
import { broadcastNsipSubscriptionEvent } from '#infrastructure/event-broadcasters.js';

import { EventType } from '@pins/event-client';

/**
 * Create or update a subscription, and publishes the corresponding event.
 *
 * @param {any} request
 * @returns {Promise<{id: number, created: boolean}>}
 */
export async function createOrUpdateSubscription(request) {
	const subscription = await prepareInput(request);

	const existing = await subscriptionRepository.findUnique(
		request.caseReference,
		request.emailAddress
	);

	if (existing === null) {
		// new subscription
		const res = await subscriptionRepository.create(subscription);

		await broadcastNsipSubscriptionEvent(res, EventType.Create);

		return { id: res.id, created: true };
	}

	// update existing
	const res = await subscriptionRepository.update(existing.id, subscription);

	const eventsByType = subscriptionTypeChanges(existing, res);

	for (const [type, payloads] of Object.entries(eventsByType)) {
		await eventClient.sendEvents(NSIP_SUBSCRIPTION, payloads, type);
	}

	return { id: res.id, created: false };
}

/**
 * @param {any} request
 * @returns {Promise<import('@prisma/client').Prisma.SubscriptionCreateInput>}
 */
export async function prepareInput(request) {
	/** @type {string} */
	const emailAddress = request.emailAddress;

	// Get or create the service user
	const existingServiceUser = await serviceUserRepository.findByEmail(emailAddress);

	/** @type {import('@prisma/client').Prisma.SubscriptionCreateInput} */
	const subscription = {
		caseReference: request.caseReference,
		// If a service user already exists, connect it. Otherwise, create a new one.
		subscriber: existingServiceUser
			? {
					connect: {
						id: existingServiceUser.id
					}
			  }
			: {
					create: {
						email: emailAddress
					}
			  },
		// TODO: Once we're happy with the new 'subscriberId' functionality, we can delete this record
		emailAddress: emailAddress
	};

	typesToSubscription(request.subscriptionTypes, subscription);

	if (request.startDate) {
		subscription.startDate = new Date(request.startDate);
	} else {
		subscription.startDate = null; // ensure updates remove previous values
	}

	if (request.endDate) {
		subscription.endDate = new Date(request.endDate);
	} else {
		subscription.endDate = null; // ensure updates remove previous values
	}

	if (request.language) {
		subscription.language = request.language;
	}

	return subscription;
}
