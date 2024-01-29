import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { applicationsRoutes } from './applications/applications.routes.js';
import { defaultErrorHandler, stateMachineErrorHandler } from './middleware/error-handler.js';
import versionRoutes from './middleware/version-routes.js';
import BackOfficeAppError from './utils/app-error.js';
import { databaseConnector } from './utils/database-connector.js';
import { migrationRoutes } from './migration/migration.routes.js';
import { authoriseRequest } from './middleware/authorise-request.js';
import { asyncHandler } from '@pins/express';

// The purpose of this is to allow the jest environment to create an instance of the app without loading Swagger
// We have to use a HOF (i.e. we can't just conditionally register swagger UI) because Jest doesn't care about our conditionals and loads all of the modules based on the top-level imports
// @ts-ignore
const buildApp = (
	/** @type {(app: import("express-serve-static-core").Express) => void} */ addSwaggerUi = null
) => {
	const app = express();

	if (addSwaggerUi) {
		addSwaggerUi(app);
	}

	// Ordering is important - health-check here ensures that no api key check
	// occurs on request to this endpoint.
	app.get('/health', async (req, res) => {
		try {
			await databaseConnector.$queryRaw`SELECT 1;`;
		} catch {
			res.status(500).send('Database connection failed during health check');
			return;
		}

		res.status(200).send('OK');
	});

	app.use(asyncHandler(authoriseRequest));

	app.use('/migration', bodyParser.json({ limit: '30mb' }));
	app.use(bodyParser.json());

	app.use(compression());
	app.use(morgan('combined'));
	app.use(helmet());

	app.use(
		'/applications',
		versionRoutes({
			1: applicationsRoutes
		})
	);

	app.use('/migration', migrationRoutes);

	app.get('/', (req, res, next) => {
		if (req.headers['user-agent'] === 'AlwaysOn') {
			res.status(204).end();
		} else {
			next();
		}
	});

	app.all('*', (req, res, next) => {
		next(new BackOfficeAppError(`Method is not allowed`, 405));
	});

	app.use(stateMachineErrorHandler);
	app.use(defaultErrorHandler);

	return app;
};

export { buildApp };
