import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';
import { homeRoutes } from './app/home/home.routes.js';
import { validationRoutes } from './app/validation/validation.routes.js';

const app = express();

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
const swaggerOptions = {
	definition: {
		swagger: "2.0",
		info: { 
			title: "PINS Back-office project ",
			description: "PINS Back-office project API Information",
    		version: "2.0"
			},
		servers: ["http://localhost:3000/"],
		paths: {
			"/validation": {
				get: {
					summary: "List of appeals to be validated",
					parameters: {
						
					}
				}

		}
	},
		},
	//apis: [".routes/*.js"]
	apis: ["app.js"]
}
const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(compression());
app.use(morgan('combined'));
app.use(helmet());

app.use('/', homeRoutes);

app.use('/validation', validationRoutes);

export {
	app
};
