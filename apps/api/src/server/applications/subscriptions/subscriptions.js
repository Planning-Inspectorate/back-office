import { Subscription } from '@pins/applications/lib/application/subscription.js';
import { EventType } from '@pins/event-client';

/**
 * @typedef {import('../../../message-schemas/events/nsip-subscription.d.js').NSIPSubscription} NSIPSubscription
 * @typedef {import('../../../message-schemas/events/service-user.d.js').ServiceUser} ServiceUser
 * @typedef {import('@pins/applications').SubscriptionType} SubscriptionType
 */

/**
 * Convert from the subscription database type to the subscription response type
 *
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {import('@pins/applications').Subscription}
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

	return types.map((t) => copyPayloadWithType(payload, t));
}

/**
 * Base payload for a subscription event, without a subscription type.
 *
 * @param {import('@pins/applications.api').Schema.Subscription} subscription
 * @returns {NSIPSubscription}
 * @throws {Error}
 */
export function buildSubscriptionBasePayload(subscription) {
	if (!subscription.serviceUser?.email) {
		throw new Error('cannot build subscription payload: email is undefined');
	}

	/** @type {NSIPSubscription} */
	const payload = {
		caseReference: subscription.caseReference,
		emailAddress: subscription.serviceUser.email,
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

/**
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {SubscriptionType[]}
 */
export function subscriptionToTypes(subscription) {
	if (subscription.subscribedToAllUpdates) {
		return [Subscription.Type.allUpdates];
	}

	/** @type {SubscriptionType[]} */
	const types = [];

	if (subscription.subscribedToApplicationDecided) {
		types.push(Subscription.Type.applicationDecided);
	}
	if (subscription.subscribedToApplicationSubmitted) {
		types.push(Subscription.Type.applicationSubmitted);
	}
	if (subscription.subscribedToRegistrationOpen) {
		types.push(Subscription.Type.registrationOpen);
	}

	return types;
}

/**
 *
 * @param {SubscriptionType[]} types
 * @param {import('@prisma/client').Prisma.SubscriptionCreateInput} subscription
 * @returns {import('@prisma/client').Prisma.SubscriptionCreateInput}
 */
export function typesToSubscription(types, subscription) {
	const _subscription = {
		...subscription,
		// ensure all fields are reset to false (not just left as they are) for updates
		subscribedToApplicationDecided: false,
		subscribedToApplicationSubmitted: false,
		subscribedToRegistrationOpen: false,
		subscribedToAllUpdates: types.includes(Subscription.Type.allUpdates)
	};

	if (_subscription.subscribedToAllUpdates) {
		return _subscription;
	}

	for (const type of types) {
		switch (type) {
			case Subscription.Type.applicationSubmitted:
				_subscription.subscribedToApplicationSubmitted = true;
				break;
			case Subscription.Type.applicationDecided:
				_subscription.subscribedToApplicationDecided = true;
				break;
			case Subscription.Type.registrationOpen:
				_subscription.subscribedToRegistrationOpen = true;
				break;
		}
	}

	return _subscription;
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
 * @param {import('@pins/applications.api').Schema.Subscription} subscription
 * @return {ServiceUser}
 * */
export const buildServiceUserPayload = (subscription) => ({
	id: subscription.serviceUser.id.toString(),
	firstName: subscription.serviceUser.firstName,
	lastName: subscription.serviceUser.lastName,
	addressLine1: subscription.serviceUser.address?.addressLine1,
	addressLine2: subscription.serviceUser.address?.addressLine2,
	addressTown: subscription.serviceUser.address?.town,
	addressCounty: subscription.serviceUser.address?.county,
	postcode: subscription.serviceUser.address?.postcode,
	addressCountry: subscription.serviceUser.address?.country,
	organisation: subscription.serviceUser.organisationName,
	role: subscription.serviceUser.jobTitle,
	telephoneNumber: subscription.serviceUser.phoneNumber,
	emailAddress: subscription.serviceUser.email,
	serviceUserType: 'Subscriber',
	caseReference: subscription.caseReference,
	sourceSuid: subscription.serviceUser.id.toString(),
	sourceSystem: 'BO'
});

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
