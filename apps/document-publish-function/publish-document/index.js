/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, document) => {
	context.log(`Message ${JSON.stringify(document)}`);
};
