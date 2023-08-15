import { getEventClient, EventType } from '@pins/event-client';
import config from './config';

const { serviceBusHost, serviceBusTopic } = config;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {boolean} successful
 * @param {{ deadline: string, submissionType: string, blobGuid: string, documentName: string }} _
 * */
async function sendEvent(
	context,
	successful,
	{ deadline, submissionType, blobGuid, documentName }
) {
	const eventClient = getEventClient(true, context.log, serviceBusHost);

	const event = {
		status: successful ? 'SUCCESS' : 'FAILURE',
		deadline,
		submissionType,
		blobGuid,
		documentName
	};

	await eventClient.sendEvents(
		serviceBusTopic,
		[event],
		successful ? EventType.Success : EventType.Failure
	);
}

export default { sendEvent };
