import fs from 'node:fs';
import appInsights from 'applicationinsights';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { buildApp } from './build-app.js';
import config from './config/config.js';
import logger from '#utils/logger.js';

if (config.APPLICATIONINSIGHTS_CONNECTION_STRING) {
	try {
		appInsights
			.setup(config.APPLICATIONINSIGHTS_CONNECTION_STRING)
			.setAutoCollectConsole(true, true)
			.setSendLiveMetrics(true)
			.start();
	} catch (err) {
		logger.warn({ err }, 'Application insights failed to start: ');
	}
} else {
	logger.warn(
		'Skipped initialising Application Insights because `APPLICATIONINSIGHTS_CONNECTION_STRING` is undefined. If running locally, this is expected.'
	);
}

const app = buildApp((expressApp) => {
	// @ts-ignore
	const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

	// @ts-ignore
	expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));
});

export { app };
