import {
	buildSubscriptionBasePayload,
	subscriptionToTypes
} from '#infrastructure/payload-builders/subscriptions.js';

/**
 * Convert from the subscription database type to the subscription response type
 *
 * @param {import('@pins/applications.api').Schema.Subscription} subscription
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
