import { publishDocument } from './publish-document.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, myQueueItem) => {
	const { documentToCopy, documentDestination } = myQueueItem;

	await publishDocument(context, documentToCopy, documentDestination);
	context.log('Publishing document');
	context.log(myQueueItem);
};
