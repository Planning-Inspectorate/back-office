import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { applicationsRoutes } from './applications/applications.routes.js';
import config from './config/config.js';
import { authorizeClientMiddleware } from './middleware/auth-handler.js';
import { defaultErrorHandler, stateMachineErrorHandler } from './middleware/error-handler.js';
import versionRoutes from './middleware/version-routes.js';
import BackOfficeAppError from './utils/app-error.js';

const app = express();

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(bodyParser.json());

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use(authorizeClientMiddleware);

app.use(
	'/appeals',
	versionRoutes({
		1: appealsRoutes
	})
);

app.use(
	'/applications',
	versionRoutes({
		1: applicationsRoutes
	})
);

app.all('*', (req, res, next) => {
	next(new BackOfficeAppError(`Method is not allowed`, 405));
});

app.use(stateMachineErrorHandler);
app.use(defaultErrorHandler);

export { app };
