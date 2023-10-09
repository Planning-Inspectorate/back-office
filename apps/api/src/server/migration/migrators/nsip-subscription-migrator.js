import { databaseConnector } from '#utils/database-connector.js';
import { eventClient } from '#infrastructure/event-client.js';
import { getOrCreateMinimalCaseId } from './utils.js';
import {
	buildSubscriptionPayloads,
	typesToSubscription
} from '../../applications/subscriptions/subscriptions.js';
import { NSIP_SUBSCRIPTION } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { buildUpsertForEntity } from './sql-tools.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';

/**
 * @typedef {import('../../../message-schemas/events/nsip-subscription.d.ts').NSIPSubscription} NSIPSubscription
 * @typedef {NSIPSubscription & import('./utils.js').NSIPProjectMinimalCaseData} NSIPSubscriptionMigrateModel
 */

/**
 * @typedef {NSIPSubscriptionMigrateModel & {subscriptionTypes: string[]}} NSIPSubscriber
 */

/**
 * Migrate NSIP Subscriptions
 *
 * @param {NSIPSubscriptionMigrateModel[]} subscriptions
 */
export const migrateNsipSubscriptions = async (subscriptions) => {
	console.info(`Migrating ${subscriptions.length} NSIP Subscriptions`);

	const subscribers = mapSubscriptionsToSubscribers(subscriptions);

	console.info(`Consolidated subscriptions, migrating ${subscribers.length} Subscribers`);

	for (const model of subscribers) {
		const entity = await mapModelToEntity(model);

		if (entity.id >= MigratedEntityIdCeiling) {
			throw Error(`Unable to migrate entity id=${entity.id} - identity above threshold`);
		}

		const { statement, parameters } = buildUpsertForEntity('Subscription', entity, 'id');

		await databaseConnector.$transaction([
			databaseConnector.$executeRawUnsafe(statement, ...parameters)
		]);
	}

	const events = await buildEventPayloads(
		// @ts-ignore - subscriptionId will never be undefined here
		subscribers.map((subscriber) => subscriber.subscriptionId)
	);

	console.info(`Broadcasting updates for ${events.length} entities`);

	if (events.length > 0) {
		await eventClient.sendEvents(NSIP_SUBSCRIPTION, events, EventType.Update);
	}
};

/**
 *
 * @param {number[]} subscriberIds
 *
 * @returns {Promise<NSIPSubscription[]>} eventsToBroadcast
 */
const buildEventPayloads = async (subscriberIds) => {
	const updatedSubscriptions = await databaseConnector.subscription.findMany({
		where: { id: { in: subscriberIds } }
	});

	return updatedSubscriptions.map(buildSubscriptionPayloads).flat();
};

/**
 * For a given case, a user can have multiple subscriptions with different types. We store them as a single 'subscriber' entity with multiple 'subscription types'.
 * The PINS Data Model defines these as separate 'subscriptions'.
 *
 * From the migrated data, we pull the existing 'subscriber.user_id' as 'subscriptionId' (so it's actually a subscriber id, not a subscription id)
 *
 * Additionally, there's an issue in NI which allows a user to subscribe multiple times - which is not permitted in the back office.
 * To resolve this, we're taking the 'latest' subscription.
 *
 * @param {NSIPSubscriptionMigrateModel[]} subscriptions
 *
 * @returns {NSIPSubscriber[]} subscribers
 */
const mapSubscriptionsToSubscribers = (subscriptions) => {
	return [
		...subscriptions
			.reduce((map, subscription) => {
				const subscriptionKey = `${subscription.emailAddress}-${subscription.caseReference}`;

				const existingSubscriber = map.get(subscriptionKey);

				if (
					!existingSubscriber ||
					(subscription.startDate && subscription.startDate > existingSubscriber.startDate)
				) {
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
 * @returns {Promise<import('@prisma/client').Prisma.SubscriptionCreateInput & { id: number }>}} projectUpdate
 */
const mapModelToEntity = async (m) => {
	const caseId = await getOrCreateMinimalCaseId(m);

	if (!caseId) {
		throw Error(
			`Unknown case reference ${m.caseReference} for subscription id ${m.subscriptionId}`
		);
	}

	if (!m.subscriptionId) {
		throw Error('Missing subscription ID');
	}

	const entity = {
		id: m.subscriptionId,
		emailAddress: m.emailAddress,
		caseReference: m.caseReference,
		startDate: m.startDate ? new Date(m.startDate) : null,
		caseId
	};

	typesToSubscription(m.subscriptionTypes, entity);

	return entity;
};
