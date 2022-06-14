import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { defaultErrorHandler, stateMachineErrorHandler } from './appeals/middleware/error-handler.js';
import config from './config/config.js';

const app = express();

import bodyParser from 'body-parser';

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(bodyParser.json());

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/appeals', appealsRoutes)

app.use(stateMachineErrorHandler);
app.use(defaultErrorHandler);

export { app };
