/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, eventGridEvent) => {
	context.log('JavaScript Event Grid function processed a request.');
	context.log(`Subject: ${eventGridEvent.subject}`);
	context.log(`Time: ${eventGridEvent.eventTime}`);
	context.log(`Data: ${JSON.stringify(eventGridEvent.data)}`);
};
