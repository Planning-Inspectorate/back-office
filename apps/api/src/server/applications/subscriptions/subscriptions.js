/**
 * @typedef {import('../../../message-schemas/events/nsip-subscription.d.js').NSIPSubscription} NSIPSubscription
 */

/**
 * @param {import('@prisma/client').Subscription} subscription
 * @returns {NSIPSubscription}
 */
export function buildSubscriptionPayload(subscription) {
	/** @type {NSIPSubscription} */
	const payload = {
		caseReference: subscription.caseReference,
		emailAddress: subscription.emailAddress,
		subscriptionType: subscription.subscriptionType
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
