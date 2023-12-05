import appInsights from 'applicationinsights';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import logger from '#utils/logger.js';
import { buildApp } from './build-app.js';
import config from './config/config.js';

if (config.APPLICATIONINSIGHTS_CONNECTION_STRING) {
	try {
		appInsights
			.setup(config.APPLICATIONINSIGHTS_CONNECTION_STRING)
			.setAutoCollectConsole(true, true)
			.setSendLiveMetrics(true);

		appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
			'API';

		appInsights.start();
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}
} else {
	logger.warn(
		'Skipped initialising Application Insights because `APPLICATIONINSIGHTS_CONNECTION_STRING` is undefined. If running locally, this is expected.'
	);
}

const app = buildApp((expressApp) => {
	const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

	expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));
});

export { app };
