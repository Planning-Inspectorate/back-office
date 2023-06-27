import { EventType } from '@pins/event-client';
import api from './back-office-api-client';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/service-bus').ServiceBusReceivedMessage} msg
 */
export default async function (context, msg) {
	context.log('Handle subscription message', msg);

	const hasType =
		Boolean(msg && msg.applicationProperties) &&
		Object.prototype.hasOwnProperty.call(msg.applicationProperties, 'type');
	if (!hasType) {
		context.log.warn('Ingoring invalid message, no type', msg);
		return;
	}

	const type = msg.applicationProperties?.type;

	if (type !== EventType.Create && type !== EventType.Delete) {
		context.log.warn(`Ingoring invalid message, unsupported type '${type}'`, msg);
		return;
	}

	if (type === EventType.Create) {
		try {
			/** @type {import('@pins/api/src/message-schemas/commands/register-nsip-subscription').RegisterNSIPSubscription} */
			const body = msg.body;
			// todo: should we validate the request, or leave to the API?
			const res = await api.createOrUpdateSubscription({
				...body.nsipSubscription,
				subscriptionTypes: body.subscriptionTypes
			});
			context.log.info(`subscription created/updated: ${res.id}`);
		} catch (e) {
			context.log.error('error creating/updating subscription', e);
		}
	} else if (type === EventType.Delete) {
		try {
			const { caseReference, emailAddress } = msg.body;
			if (!caseReference || typeof caseReference !== 'string') {
				context.log.warn(`Ingoring invalid message, invalid caseReference`, msg);
				return;
			}
			if (!emailAddress || typeof emailAddress !== 'string') {
				context.log.warn(`Ingoring invalid message, invalid emailAddress`, msg);
				return;
			}
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
