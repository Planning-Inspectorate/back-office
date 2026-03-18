import { handleSuggestions } from './src/handle-suggestions.js';
import { handleFinalRedaction } from './src/handle-final-redaction.js';

/**
 * Azure Service Bus subscriber for AI doc redaction process
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, message) => {
	context.log('Received ai doc redaction message');

	try {
		const { stage } = message;

		switch (stage) {
			case 'ANALYSE':
				await handleSuggestions(context, message);
				break;

			case 'REDACT':
				await handleFinalRedaction(context, message);
				break;

			default:
				context.log(`Ignoring stage ${stage}`);
		}
	} catch (error) {
		context.log.error('Redaction subscriber failed');
		context.log.error(error);
		throw error;
	}
};
