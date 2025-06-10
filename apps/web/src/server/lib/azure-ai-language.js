import { TextAnalyticsClient, AzureKeyCredential } from '@azure/ai-text-analytics';
import config from '@pins/applications.web/environment/config.js';
import logger from './logger.js';

// cache the instance of the client
/** @type {TextAnalyticsClient|undefined} */
let client;

/** @returns {TextAnalyticsClient} */
export function getAzureTextAnalyticsClient() {
	if (client) {
		return client;
	}
	if (config.azureAiLanguage.key === undefined || config.azureAiLanguage.endpoint === undefined) {
		logger.error(
			{
				azureAiLanguage: {
					endpoint: config.azureAiLanguage.endpoint,
					keyType: typeof config.azureAiLanguage.key
				}
			},
			'missing Azure AI language configuration'
		);
		throw new Error('Azure AI Language service is not configured correctly');
	}
	client = new TextAnalyticsClient(
		config.azureAiLanguage.endpoint,
		new AzureKeyCredential(config.azureAiLanguage.key)
	);
	return client;
}
