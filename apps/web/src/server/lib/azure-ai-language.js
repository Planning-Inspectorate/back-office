import { TextAnalyticsClient } from '@azure/ai-text-analytics';
import config from '@pins/applications.web/environment/config.js';
import logger from './logger.js';
import { DefaultAzureCredential } from '@azure/identity';

/**
 * All categories are used by default, can be overridden in the config
 * @see https://learn.microsoft.com/en-us/javascript/api/%40azure/ai-language-text/piientitycategory?view=azure-node-latest
 * @type {string[]|undefined}
 */
export const DEFAULT_CATEGORIES = undefined;

// cache the instance of the client
/** @type {TextAnalyticsClient|undefined} */
let client;

/** @returns {TextAnalyticsClient} */
export function getAzureTextAnalyticsClient() {
	if (client) {
		return client;
	}
	if (config.azureAiLanguage.endpoint === undefined) {
		logger.error(
			{
				azureAiLanguage: {
					endpoint: config.azureAiLanguage.endpoint
				}
			},
			'missing Azure AI language configuration'
		);
		throw new Error('Azure AI Language service is not configured correctly');
	}
	client = new TextAnalyticsClient(config.azureAiLanguage.endpoint, new DefaultAzureCredential());
	return client;
}

/**
 * @returns {string[]|undefined}
 */
export function getAzureLanguageCategories() {
	if (config.azureAiLanguage.categories && typeof config.azureAiLanguage.categories === 'string') {
		return config.azureAiLanguage.categories.split(',').map((e) => e.trim());
	}
	return DEFAULT_CATEGORIES;
}
