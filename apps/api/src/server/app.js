import appInsights from 'applicationinsights';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import logger from '#utils/logger.js';
import { buildApp } from './build-app.js';
import config from './config/config.js';

try {
	appInsights
		.setup(config.APPLICATIONINSIGHTS_CONNECTION_STRING)
		.setAutoDependencyCorrelation(true)
		.setAutoCollectConsole(true)
		.setSendLiveMetrics(true)
		.start();
} catch (err) {
	logger.warn({ err }, 'Application insights failed to start: ');
}

const app = buildApp((expressApp) => {
	const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

	expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));
});

export { app };
