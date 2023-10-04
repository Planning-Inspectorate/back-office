import { EventType } from '@pins/event-client';
import api from './back-office-api-client.js';

/**
 * @typedef {import('@pins/applications.api/src/message-schemas/commands/register-nsip-subscription').RegisterNSIPSubscription} RegisterNSIPSubscription
 */

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {RegisterNSIPSubscription} msg
 */
export default async function (context, msg) {
	const msgWithoutEmail = redactEmailForLogs(msg);
	context.log('Handle subscription message', msgWithoutEmail);

	const applicationProperties = context?.bindingData?.applicationProperties;

	const hasType =
		Boolean(applicationProperties) &&
		Object.prototype.hasOwnProperty.call(applicationProperties, 'type');
	if (!hasType) {
		context.log.warn('Ingoring invalid message, no type', msgWithoutEmail);
		return;
	}

	const type = applicationProperties?.type;

	if (type !== EventType.Create && type !== EventType.Delete) {
		context.log.warn(`Ingoring invalid message, unsupported type '${type}'`, msgWithoutEmail);
		return;
	}

	if (!msg.nsipSubscription) {
		context.log.warn(`Ingoring invalid message, nsipSubscription is required`, msgWithoutEmail);
		return;
	}

	const { caseReference, emailAddress } = msg.nsipSubscription;
	if (!caseReference || typeof caseReference !== 'string') {
		context.log.warn(`Ingoring invalid message, invalid caseReference`, msgWithoutEmail);
		return;
	}
	if (!emailAddress || typeof emailAddress !== 'string') {
		context.log.warn(`Ingoring invalid message, invalid emailAddress`, msgWithoutEmail);
		return;
	}

	if (type === EventType.Create) {
		if (!msg.subscriptionTypes) {
			context.log.warn(`Ingoring invalid message, subscriptionTypes is required`, msgWithoutEmail);
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
				context.log.warn(`Existing subscription not found`, msgWithoutEmail);
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

/**
 *
 * @param {RegisterNSIPSubscription} msg
 * @returns {RegisterNSIPSubscription}
 */
export function redactEmailForLogs(msg) {
	if (msg?.nsipSubscription?.emailAddress) {
		return {
			nsipSubscription: {
				...msg.nsipSubscription,
				emailAddress: '<redacted>'
			},
			subscriptionTypes: msg.subscriptionTypes
		};
	}
	return msg;
}
