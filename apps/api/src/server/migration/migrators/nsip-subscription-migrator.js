import { databaseConnector } from '#utils/database-connector.js';
import { eventClient } from '#infrastructure/event-client.js';
import { getCaseIdFromRef } from './utils.js';
import {
	buildSubscriptionPayloads,
	typesToSubscription
} from '../../applications/subscriptions/subscriptions.js';
import { NSIP_SUBSCRIPTION } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

/**
 * @typedef {import('../../../message-schemas/events/nsip-subscription.d.ts').NSIPSubscription} NSIPSubscription
 */

/**
 * @typedef {NSIPSubscription & {subscriptionTypes: string[]}} NSIPSubscriber
 */

/**
 * Migrate NSIP Subscriptions
 *
 * @param {NSIPSubscription[]} subscriptions
 */
export const migrateNsipSubscriptions = async (subscriptions) => {
	console.info(`Migrating ${subscriptions.length} NSIP Subscriptions`);

	/** @type {import('@prisma/client').Subscription[]} */
	const updatesToBroadcast = [];

	const subscribers = mapSubscriptionsToSubscribers(subscriptions);

	console.info(`Consolidated subscriptions, migrating ${subscribers.length} Subscribers`);

	for (const model of subscribers) {
		const entity = await mapModelToEntity(model);

		const existingSubscription = await databaseConnector.subscription.findFirst({
			where: { migratedId: entity.migratedId },
			select: { id: true }
		});

		const updatedEntity = existingSubscription
			? await databaseConnector.subscription.update({
					where: { id: existingSubscription.id },
					data: entity
			  })
			: await databaseConnector.subscription.create({
					data: entity
			  });

		updatesToBroadcast.push(updatedEntity);
	}

	console.info(`Broadcasting updates for ${updatesToBroadcast.length} entities`);

	const events = updatesToBroadcast.map((updatedEntity) =>
		buildSubscriptionPayloads(updatedEntity)
	);

	await eventClient.sendEvents(NSIP_SUBSCRIPTION, events, EventType.Update);
};

/**
 * For a given case, a user can have multiple subscriptions with different types. We store them as a single 'subscriber' entity with multiple 'subscription types'.
 * The PINS Data Model defines these as separate 'subscriptions', so we must first group all subscriptions into a subscriber using the email and case reference.
 *
 * @param {NSIPSubscription[]} subscriptions
 *
 * @returns {NSIPSubscriber[]} subscribers
 */
const mapSubscriptionsToSubscribers = (subscriptions) => {
	return [
		...subscriptions
			.reduce((map, subscription) => {
				const subscriptionKey = `${subscription.emailAddress}-${subscription.caseReference}`;

				const existingSubscriber = map.get(subscriptionKey);

				if (!existingSubscriber) {
					/** @type {NSIPSubscriber} */
					const subscriber = {
						...subscription,
						subscriptionTypes: [subscription.subscriptionType]
					};

					// @ts-ignore
					delete subscriber.subscriptionType;

					map.set(subscriptionKey, subscriber);
				} else {
					// Let's record when we add additional types, but don't spit out the email! PII!
					console.info(
						`Subscriber ${subscription.subscriptionId} already exists, adding subscriber type ${subscription.subscriptionType}`
					);

					existingSubscriber.subscriptionTypes.push(subscription.subscriptionType);
				}

				return map;
			}, new Map())
			.values()
	];
};

/**
 *
 * @param {NSIPSubscriber} m
 *
 * @returns {Promise<import('@prisma/client').Prisma.SubscriptionCreateInput>}} projectUpdate
 */
const mapModelToEntity = async (m) => {
	const caseId = await getCaseIdFromRef(m.caseReference);

	if (!caseId) {
		throw Error(
			`Unknown case reference ${m.caseReference} for subscription id ${m.subscriptionId}`
		);
	}

	const entity = {
		migratedId: m.subscriptionId,
		emailAddress: m.emailAddress,
		caseReference: m.caseReference,
		startDate: m.startDate ? new Date(m.startDate) : null,
		caseId
	};

	typesToSubscription(m.subscriptionTypes, entity);

	return entity;
};
