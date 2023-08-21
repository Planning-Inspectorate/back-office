import { getEventClient, EventType } from '@pins/event-client';
import config from './config';

const { serviceBusHost, serviceBusTopic } = config;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {{ deadline: string, submissionType: string, blobGuid: string, documentName: string }} _
 * */
async function publishFailureEvent(context, { deadline, submissionType, blobGuid, documentName }) {
	const eventClient = getEventClient(true, context.log, serviceBusHost);

	const event = {
		status: 'FAILURE',
		deadline,
		submissionType,
		blobGuid,
		documentName
	};

	await eventClient.sendEvents(serviceBusTopic, [event], EventType.Create);
}

export default { publishFailureEvent };
