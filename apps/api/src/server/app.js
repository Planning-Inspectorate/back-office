import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { homeRoutes } from './app/home/home.routes.js';
import { validationRoutes } from './app/validation/validation.routes.js';

const app = express();

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import {swaggerOptions} from './swaggerOptions.js';

const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//import swaggerAuto from '../../../../swagger-output.json';
import swaggerAuto from '../../../../swagger-output.json' assert { type: 'json' };

//const specsAuto = swaggerJsDoc(swaggerAuto);
app.use('/api-docs2', swaggerUi.serve, swaggerUi.setup(swaggerAuto));

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);

app.use('/validation', validationRoutes);

export {
	app
};
