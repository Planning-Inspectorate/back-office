import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { documentsRouter } from './app/routes.js';
import { errorHandler } from './app/middleware/error-handler.js';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', documentsRouter);

app.use(errorHandler);

export default app;
