import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { homeRoutes } from './app/home/home.routes.js';
import { validationRoutes } from './app/validation/validation.routes.js';

const app = express();

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve('..','..','swagger-output.json')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);

app.use('/validation', validationRoutes);

export {
	app
};
