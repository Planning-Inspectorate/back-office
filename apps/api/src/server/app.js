import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { caseOfficerRoutes } from './app/case-officer/case-officer.routes.js';
import { inspectorRoutes } from './app/inspector/inspector.routes.js';
import { defaultErrorHandler, stateMachineErrorHandler } from './app/middleware/error-handler.js';
import versionRoutes from './app/middleware/version-routes.js';
import { validationRoutes } from './app/validation/validation.routes.js';
import config from './config/config.js';

const app = express();

import bodyParser from 'body-parser';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
app.use(bodyParser.json());

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use(
	'/validation',
	versionRoutes({
		1: validationRoutes
	})
);

app.use(
	'/case-officer',
	versionRoutes({
		1: caseOfficerRoutes
	})
);

app.use(
	'/inspector',
	versionRoutes({
		1: inspectorRoutes
	})
);

app.use(stateMachineErrorHandler);
app.use(defaultErrorHandler);

export { app };
