import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import requestID from 'express-request-id';
import helmet from 'helmet';
import morganLogger from 'morgan';
import responseTime from 'response-time';
import serveStatic from 'serve-static';
import { config } from '../config/config.js';
import locals from '../config/locals.js';
import nunjucksEnvironment from '../config/nunjucks.js';
import session from '../config/session.js';
import { routes } from './routes.js';

// Create a new Express app.
const app = express();

// Initialize app locals
app.locals = locals;

if (!config.isProd) {
	app.use(morganLogger('dev'));
}

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

// Secure apps by setting various HTTP headers
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			scriptSrc: [
				"'self'", // eslint-disable-line quotes
				() => `'nonce-EdcOUaJ8lczj9tIPO0lPow=='` // eslint-disable-line quotes
			]
		}
	})
);

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Enable compression middleware
app.use(compression());

app.use(requestID());

// Response time header
app.use(responseTime());

// Session middleware
app.use(session);

// Set the express view engine to nunjucks.
nunjucksEnvironment.express(app);
app.set('view engine', 'njk');

// Serve static files (fonts, images, generated CSS and JS, etc)
app.use(serveStatic('src/server/static'));

// Mount all routes on / path.
// All the other subpaths will be defined in the `routes.js` file.
app.use('/', routes);

// Error pages
// ! Express middleware executes in order. We should define error handlers last, after all other middleware.
// ! Otherwise, our error handler won't get called.
// Catch all "server" (the ones in the routing flow) errors and and render generic error page
// with the error message if the app runs in dev mode, or geneirc error if running in production.
app.use(
	/** @type {import('express').ErrorRequestHandler} */
	(error, request, response, next) => {
		if (response.headersSent) {
			next(error);
		}

		response.status(500);
		response.render('app/error', { error: error });
	}
);

// Catch undefined routes (404) and render generic 404 not found page
app.use((request, response) => {
	response.status(404).render('app/404');
});

export { app };
