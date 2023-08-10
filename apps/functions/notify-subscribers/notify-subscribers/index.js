import govNotify from 'notifications-node-client';
import { BackOfficeApiClient } from './src/back-office-api-client.js';
import { loadConfig } from './src/config.js';
import { NotifySubscribers } from './src/notify-subscribers.js';
import { unsubscribeLink } from './src/util.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@pins/applications.api/src/message-schemas/events/nsip-project-update.js').NSIPProjectUpdate} msg
 */
export default async function (context, msg) {
	const config = loadConfig();

	const apiClient = new BackOfficeApiClient(config.API_HOST);
	const notifyClient = new govNotify.NotifyClient(config.GOV_NOTIFY_API_KEY);
	const notify = new NotifySubscribers({
		apiClient,
		notifyClient,
		perPage: config.SUBSCRIPTIONS_PER_BATCH,
		waitPerPage: config.WAIT_PER_BATCH_SECONDS,
		templateId: config.GOV_NOTIFY_TEMPLATE_ID,
		msg,
		logger: context.log,
		invocationId: context.invocationId,
		generateUnsubscribeLink: unsubscribeLink
	});

	await notify.run();
}
