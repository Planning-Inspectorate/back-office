import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { homeRoutes } from './app/home/home.routes.js';
import { validationRoutes } from './app/validation/validation.routes.js';
import { caseOfficerRoutes } from './app/lpa-questionnaire/lpa-questionnaire.get-appeals.routes.js';
import errorHandler from './app/middleware/error-handler.js';
import config from './config/config.js';

const app = express();

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
app.use(bodyParser.json());

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));
// const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve( 'src', 'server', 'swagger-output.json')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);

app.use('/validation', validationRoutes);

app.use('/case-officer', caseOfficerRoutes);

app.use(errorHandler);

export {
	app
};
