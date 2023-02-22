/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, myQueueItem) => {
	context.log('Publishing document');
	context.log(myQueueItem);
};
