import { EventType } from '@pins/event-client';

/**
 * @typedef {import('../../../message-schemas/events/nsip-subscription.d.js').NSIPSubscription} NSIPSubscription
 * @typedef {import('../../../message-schemas/events/nsip-subscription.d.js').SubscriptionType} SubscriptionType
 */

/**
 * Convert from the subscription database type to the subscription response type
 *
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {import('./subscription.d.ts').Subscription}
 */
export function subscriptionToResponse(subscription) {
	/** @type {any} */
	const res = buildSubscriptionBasePayload(subscription);
	res.id = subscription.id;
	res.subscriptionTypes = subscriptionToTypes(subscription);
	delete res.subscriptionType;
	delete res.subscriptionId;
	return res;
}

/**
 * Create a payload (event) for each subscription type for this subscription.
 * Each subscription type is it's own message/event.
 *
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {NSIPSubscription[]}
 */
export function buildSubscriptionPayloads(subscription) {
	/** @type {NSIPSubscription} */
	const payload = buildSubscriptionBasePayload(subscription);
	const types = subscriptionToTypes(subscription);

	console.log('buildSubscriptionPayloads', subscription, payload, types);

	return types.map((t) => copyPayloadWithType(payload, t));
}

/**
 * Base payload for a subscription event, without a subscription type.
 *
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {NSIPSubscription}
 */
export function buildSubscriptionBasePayload(subscription) {
	/** @type {NSIPSubscription} */
	const payload = {
		caseReference: subscription.caseReference,
		emailAddress: subscription.emailAddress,
		subscriptionType: '' // overwritten later with a real value
	};
	if (subscription.id) {
		payload.subscriptionId = subscription.id;
	}
	if (subscription.startDate) {
		payload.startDate = subscription.startDate.toISOString();
	}

	if (subscription.endDate) {
		payload.endDate = subscription.endDate.toISOString();
	}

	if (subscription.language) {
		payload.language = subscription.language;
	}

	return payload;
}

export const SubscriptionTypes = {
	AllUpdates: 'allUpdates',
	ApplicationSubmitted: 'applicationSubmitted',
	ApplicationDecided: 'applicationDecided',
	RegistrationOpen: 'registrationOpen'
};

/**
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {SubscriptionType[]}
 */
export function subscriptionToTypes(subscription) {
	/** @type {SubscriptionType[]} */
	const types = [];

	if (subscription.subscribedToAllUpdates) {
		types.push(SubscriptionTypes.AllUpdates);
	} else {
		if (subscription.subscribedToApplicationDecided) {
			types.push(SubscriptionTypes.ApplicationDecided);
		}
		if (subscription.subscribedToApplicationSubmitted) {
			types.push(SubscriptionTypes.ApplicationSubmitted);
		}
		if (subscription.subscribedToRegistrationOpen) {
			types.push(SubscriptionTypes.RegistrationOpen);
		}
	}
	return types;
}

/**
 *
 * @param {SubscriptionType[]} types
 * @param {import('@prisma/client').Prisma.SubscriptionCreateInput} subscription
 */
export function typesToSubscription(types, subscription) {
	if (types.includes(SubscriptionTypes.AllUpdates)) {
		subscription.subscribedToAllUpdates = true;
	} else {
		for (const type of types) {
			switch (type) {
				case SubscriptionTypes.ApplicationSubmitted:
					subscription.subscribedToApplicationSubmitted = true;
					break;
				case SubscriptionTypes.ApplicationDecided:
					subscription.subscribedToApplicationDecided = true;
					break;
				case SubscriptionTypes.RegistrationOpen:
					subscription.subscribedToRegistrationOpen = true;
					break;
			}
		}
	}
}

/**
 * @typedef {Object<string,NSIPSubscription[]>} EventsByType
 */

/**
 * Given an existing and updated subscription, what are the subscription type changes?
 * For each of those changes, generate an associated subscription event
 *
 * For example, if a subscription is updated to add an "applicationDecided" subscription,
 * a Create event will be sent for that, and an Update event for any existing subscriptions.
 *
 * @param {import('@prisma/client').Subscription} existingSub
 * @param {import('@prisma/client').Subscription} newSub
 * @returns {EventsByType}
 */
export function subscriptionTypeChanges(existingSub, newSub) {
	const existingTypes = subscriptionToTypes(existingSub);
	const newTypes = subscriptionToTypes(newSub);
	const basePayload = buildSubscriptionBasePayload(newSub);

	const addedTypes = newTypes.filter((t) => !existingTypes.includes(t));
	const removedTypes = existingTypes.filter((t) => !newTypes.includes(t));
	const unchangedTypes = newTypes.filter((t) => existingTypes.includes(t));

	/** @type {EventsByType} */
	const byType = {};

	if (addedTypes.length > 0) {
		byType[EventType.Create] = addedTypes.map((t) => copyPayloadWithType(basePayload, t));
	}
	if (unchangedTypes.length > 0) {
		byType[EventType.Update] = unchangedTypes.map((t) => copyPayloadWithType(basePayload, t));
	}
	if (removedTypes.length > 0) {
		byType[EventType.Delete] = removedTypes.map((t) => copyPayloadWithType(basePayload, t));
	}

	return byType;
}

/**
 * Base payload for a subscription event, without a subscription type.
 *
 * @param {NSIPSubscription} basePayload
 * @param {SubscriptionType} type
 * @returns {NSIPSubscription}
 */
function copyPayloadWithType(basePayload, type) {
	return {
		...basePayload,
		subscriptionType: type
	};
}
