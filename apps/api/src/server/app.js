import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { appealsRoutes } from './appeals/appeals.routes.js';
import { defaultErrorHandler, stateMachineErrorHandler } from './appeals/middleware/error-handler.js';

const app = express();

import bodyParser from 'body-parser';

app.use(bodyParser.json());

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/appeals', appealsRoutes)

app.use(stateMachineErrorHandler);
app.use(defaultErrorHandler);

export { app };
