import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { homeRoutes } from './app/home/home.routes.js';
import { validationRoutes } from './app/validation/validation.routes.js';

const app = express();

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);
app.use('/validation', validationRoutes);

export {
	app
};
