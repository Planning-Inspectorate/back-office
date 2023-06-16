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
			// todo: should we validate the request, or leave to the API?
			const res = await api.createSubscription(msg.body);
			context.log.info(`subscription created: ${res.id}`);
		} catch (e) {
			context.log.error('error creating subscription', e);
		}
	}

	// todo: handle delete message
}
