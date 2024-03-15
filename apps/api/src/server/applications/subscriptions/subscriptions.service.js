import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_SUBSCRIPTION, SERVICE_USER } from '#infrastructure/topics.js';
import * as subscriptionRepository from '#repositories/subscription.respository.js';
import * as serviceUserRepository from '#repositories/service-user.repository.js';
import logger from '#utils/logger.js';
import {
	buildSubscriptionPayloads,
	subscriptionTypeChanges,
	typesToSubscription
} from '#infrastructure/payload-builders/nsip-subscription.js';
import { EventType } from '@pins/event-client';
import { verifyNotTraining } from '../application/application.validators.js';
import { buildServiceUserPayload } from '#infrastructure/payload-builders/service-user.js';

/**
 * Create or update a subscription, and publishes the corresponding event.
 *
 * @param {any} request
 * @returns {Promise<{id: number, created: boolean}>}
 */
export async function createOrUpdateSubscription(request) {
	const { subscription, isExistingUser } = await prepareInput(request);

	const existing = await subscriptionRepository.findUnique(
		request.caseReference,
		request.emailAddress
	);

	if (existing === null) {
		// new subscription
		const res = await subscriptionRepository.create(subscription);

		try {
			if (res.caseId) {
				await verifyNotTraining(res.caseId);
			}

			await eventClient.sendEvents(
				NSIP_SUBSCRIPTION,
				buildSubscriptionPayloads(res),
				EventType.Create
			);
		} catch (/** @type {*} */ err) {
			logger.info(`Blocked sending event for subscription with ID ${res.id}`, err.message);
		}

		if (!isExistingUser) {
			await eventClient.sendEvents(
				SERVICE_USER,
				[buildServiceUserPayload(res.serviceUser, res.caseReference, 'Subscriber')],
				EventType.Create,
				{
					entityType: 'Subscriber'
				}
			);
		}

		return { id: res.id, created: true };
	}

	// update existing
	const res = await subscriptionRepository.update(existing.id, subscription);

	const eventsByType = subscriptionTypeChanges(existing, res);

	for (const [type, payloads] of Object.entries(eventsByType)) {
		try {
			if (res.caseId) {
				await verifyNotTraining(res.caseId);
			}

			await eventClient.sendEvents(NSIP_SUBSCRIPTION, payloads, type);
		} catch (/** @type {*} */ err) {
			logger.info(`Blocked sending event for subscription ${res.id}`, err.message);
		}
	}

	return { id: res.id, created: false };
}

/**
 * @param {any} request
 * @returns {Promise<{isExistingUser: boolean, subscription: import('@prisma/client').Prisma.SubscriptionCreateInput}>}
 */
export async function prepareInput(request) {
	const emailAddress = request.emailAddress;
	const existingServiceUser = await serviceUserRepository.findByEmail(request.emailAddress);

	/** @type {import('@prisma/client').Prisma.SubscriptionCreateInput} */
	let subscription = {
		caseReference: request.caseReference,
		serviceUser: existingServiceUser
			? { connect: { id: existingServiceUser.id } }
			: { create: { email: emailAddress } },
		startDate: request.startDate ? new Date(request.startDate) : null, // ensure updates remove previous values
		endDate: request.endDate ? new Date(request.endDate) : null, // ensure updates remove previous values
		language: request.language ?? null
	};

	subscription = typesToSubscription(request.subscriptionTypes, subscription);

	return { isExistingUser: Boolean(existingServiceUser), subscription };
}
