import appInsights from 'applicationinsights';
import logger from '#utils/logger.js';
import config from '../config/config.js';

/** @type {*} */
export let appInsightsClient = null;

if (config.APPLICATIONINSIGHTS_CONNECTION_STRING) {
	try {
		await appInsights
			.setup(config.APPLICATIONINSIGHTS_CONNECTION_STRING)
			.setAutoCollectConsole(true, true)
			.setSendLiveMetrics(true)
			.start();

		appInsightsClient = appInsights.defaultClient;
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}
} else {
	logger.warn(
		'Skipped initialising Application Insights because `APPLICATIONINSIGHTS_CONNECTION_STRING` is undefined. If running locally, this is expected.'
	);
}