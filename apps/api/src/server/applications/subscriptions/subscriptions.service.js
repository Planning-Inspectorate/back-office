import { eventClient } from '../../infrastructure/event-client';
import { NSIP_SUBSCRIPTION } from '../../infrastructure/topics';
import * as subscriptionRepository from '../../repositories/subscription.respository.js';
import { buildSubscriptionPayload } from './subscriptions';
import { EventType } from '@pins/event-client';

/**
 * Add a new subscription, and publishes the corresponding event. Returns null if one already exists.
 *
 * @param {any} request
 * @returns {Promise<number|null>}
 */
export async function addSubscription(request) {
	/** @type {import('@prisma/client').Prisma.SubscriptionCreateInput} */
	const subscription = {
		caseReference: request.caseReference,
		emailAddress: request.emailAddress,
		subscriptionType: request.subscriptionType
	};

	if (request.startDate) {
		subscription.startDate = new Date(request.startDate);
	}
	if (request.endDate) {
		subscription.endDate = new Date(request.endDate);
	}
	if (request.language) {
		subscription.language = request.language;
	}

	const existing = await subscriptionRepository.findUnique(
		subscription.caseReference,
		subscription.emailAddress
	);

	if (existing !== null) {
		// todo: resubscribe logic?
		return null;
	}

	const res = await subscriptionRepository.create(subscription);

	await eventClient.sendEvents(
		NSIP_SUBSCRIPTION,
		[buildSubscriptionPayload(res)],
		EventType.Create
	);

	return res.id;
}
