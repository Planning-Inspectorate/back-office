import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { buildApp } from './build-app.js';
import config from '../../environment/config.js';

const app = buildApp((expressApp) => {
	const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

	expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));
});

export { app };
