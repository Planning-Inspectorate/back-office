import { EventType } from '@pins/event-client';
import api from './back-office-api-client.js';
import { redactEmailForLogs } from './logging-utils.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('./logging-utils.js').RegisterNSIPSubscription} msg
 */
export default async function (context, msg) {
	const msgWithoutEmail = redactEmailForLogs(msg);
	context.log('Handle subscription message', msgWithoutEmail);

	const applicationProperties = context?.bindingData?.applicationProperties;

	const hasType =
		Boolean(applicationProperties) &&
		Object.prototype.hasOwnProperty.call(applicationProperties, 'type');
	if (!hasType) {
		throw new Error('Ignoring invalid message, no type');
	}


	const type = applicationProperties?.type;
	if (type !== EventType.Create && type !== EventType.Delete)
		throw new Error(`Ignoring invalid message, unsupported type '${type}'`);

	const { caseReference, emailAddress } = msg.nsipSubscription;
	if (!msg.nsipSubscription)
		throw new Error('Ignoring invalid message, nsipSubscription is required');
	if (!caseReference || typeof caseReference !== 'string')
		throw new Error('Ignoring invalid message, invalid caseReference');
	if (!emailAddress || typeof emailAddress !== 'string')
		throw new Error('Ignoring invalid message, invalid emailAddress');

	if (type === EventType.Create) {
		if (!msg.subscriptionTypes)
			throw new Error(
				`Ignoring invalid message, subscriptionTypes is required`
			);

		const res = await api.createOrUpdateSubscription({
			...msg.nsipSubscription,
			subscriptionTypes: msg.subscriptionTypes
		});

		context.log.info(`subscription created/updated: ${res.id}`);
	} else if (type === EventType.Delete) {
		const existing = await api.getSubscription(caseReference, emailAddress);
		if (existing === null) throw new Error('Existing subscription not found');

		// todo: maybe we do want to delete?
		const endDate = new Date().toISOString();
		await api.updateSubscription(existing.id, { endDate });
		context.log.info(`subscription updated to end now: ${existing.id}, ${endDate}`);
	}
}
