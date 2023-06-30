import { EventType } from '@pins/event-client';
import api from './back-office-api-client.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('@pins/api/src/message-schemas/commands/register-nsip-subscription').RegisterNSIPSubscription} msg
 */
export default async function (context, msg) {
	context.log('Handle subscription message', msg);

	const applicationProperties = context?.bindingData?.applicationProperties;

	const hasType =
		Boolean(applicationProperties) &&
		Object.prototype.hasOwnProperty.call(applicationProperties, 'type');
	if (!hasType) {
		context.log.warn('Ingoring invalid message, no type', msg);
		return;
	}

	const type = applicationProperties?.type;

	if (type !== EventType.Create && type !== EventType.Delete) {
		context.log.warn(`Ingoring invalid message, unsupported type '${type}'`, msg);
		return;
	}

	if (!msg.nsipSubscription) {
		context.log.warn(`Ingoring invalid message, nsipSubscription is required`, msg);
		return;
	}

	const { caseReference, emailAddress } = msg.nsipSubscription;
	if (!caseReference || typeof caseReference !== 'string') {
		context.log.warn(`Ingoring invalid message, invalid caseReference`, msg);
		return;
	}
	if (!emailAddress || typeof emailAddress !== 'string') {
		context.log.warn(`Ingoring invalid message, invalid emailAddress`, msg);
		return;
	}

	if (type === EventType.Create) {
		if (!msg.subscriptionTypes) {
			context.log.warn(`Ingoring invalid message, subscriptionTypes is required`, msg);
			return;
		}

		try {
			const res = await api.createOrUpdateSubscription({
				...msg.nsipSubscription,
				subscriptionTypes: msg.subscriptionTypes
			});
			context.log.info(`subscription created/updated: ${res.id}`);
		} catch (e) {
			context.log.error('error creating/updating subscription', e);
		}
	} else if (type === EventType.Delete) {
		try {
			const existing = await api.getSubscription(caseReference, emailAddress);
			if (existing === null) {
				context.log.warn(`Existing subscription not found`, msg);
				return;
			}

			// todo: maybe we do want to delete?
			const endDate = new Date().toISOString();
			await api.updateSubscription(existing.id, { endDate });
			context.log.info(`subscription updated to end now: ${existing.id}, ${endDate}`);
		} catch (e) {
			context.log.error('error deleting subscription', e);
		}
	}
}
