import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import { errorHandler } from './app/middleware/error-handler.js';
import { documentsRouter } from './app/routes.js';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', documentsRouter);

app.use(errorHandler);

export default app;
