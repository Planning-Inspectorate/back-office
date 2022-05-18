import bodyParser from 'body-parser';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler } from './app/middleware/error-handler.js';
import { documentsRouter } from './app/routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import config from './config/config.js';

const app = express();

app.use(bodyParser.json());

const swaggerAuto = JSON.parse(fs.readFileSync(path.resolve(config.SWAGGER_JSON_DIR)));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', documentsRouter);

app.use(errorHandler);

export default app;
