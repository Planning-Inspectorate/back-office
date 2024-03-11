import { installRequestLocalsMiddleware } from '@pins/express';
import config from '@pins/appeals.web/environment/config.js';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import requestID from 'express-request-id';
import helmet from 'helmet';
import responseTime from 'response-time';
import serveStatic from 'serve-static';
import pino from '../lib/logger.js';
import { msalMiddleware } from '../lib/msal.js';
import appRouter from './app.router.js';
import locals from './config/locals.js';
import nunjucksEnvironment from './config/nunjucks.js';
import session from './config/session.js';
import crypto from 'node:crypto';

// Create a new Express app.
const app = express();

app.use(installRequestLocalsMiddleware());

// Initialize app locals
app.locals = locals;

app.use((request, response, next) => {
	const { req, statusCode } = response;

	if (!/((\bfonts\b)|(\bimages\b)|(\bstyles\b)|(\bscripts\b))/.test(req.originalUrl)) {
		pino.info(`[WEB] ${req.method} ${req.originalUrl.toString()} (Response code: ${statusCode})`);
	}
	next();
});

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());

// Generate the nonce for each request.  The exception is in test to allow for snapshots.
app.use((req, res, next) => {
	if (!config.isTest) {
		res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
	}
	next();
});

/**
 * Middleware to return current nonce
 *
 * @type {import('express').RequestHandler}
 * @returns {string}
 */
const addCSPNonce = (req, res) => `'nonce-${res.locals.cspNonce}'`;

// Secure apps by setting various HTTP headers
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			// @ts-ignore
			scriptSrc: ["'self'", addCSPNonce],
			defaultSrc: ["'self'", config.blobStorageUrl],
			'font-src': ["'self'"],
			'img-src': ["'self'", config.blobStorageUrl],
			'style-src': ["'self'"]
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

// MSAL middleware
app.use(msalMiddleware);

// Session middleware
app.use(session);

// Set the express view engine to nunjucks.
nunjucksEnvironment.express(app);
app.set('view engine', 'njk');

// Serve static files (fonts, images, generated CSS and JS, etc)
app.use(serveStatic('src/server/static'));

// Mount all routes on / path.
// All the other subpaths will be defined in the `routes.js` file.
app.use('/', appRouter);

// Error pages
// ! Express middleware executes in order. We should define error handlers last, after all other middleware.
// ! Otherwise, our error handler won't get called.
// Catch all "server" (the ones in the routing flow) errors and and render generic error page
// with the error message if the app runs in dev mode, or geneirc error if running in production.
app.use(
	/** @type {import('express').ErrorRequestHandler} */
	(error, req, res, next) => {
		if (error.options?.method) {
			const apiError = `[API] ${error.options?.method} ${error.options?.url?.pathname}${
				error.options?.url?.search
			} (Response code: ${error.response?.statusCode}) - ${JSON.stringify(
				error.response?.body?.errors || { error: `Error ${error.response?.statusCode}` }
			)}`;

			pino.error(apiError);
		} else {
			const javascriptError = `[WEB] ${error.message || 'Unknown error'} (Response code: ${
				error.statusCode
			})`;

			pino.error(javascriptError);
		}

		if (res.headersSent) {
			next(error);
		}

		switch (error.statusCode) {
			case 401:
				res.status(401);
				return res.render(`app/401.njk`, { error });
			case 403:
				res.status(403);
				return res.render(`app/403.njk`, { error });
			case 404:
				res.status(403);
				return res.render(`app/404.njk`, { error });
			default:
				res.status(500);
				return res.render(`app/500.njk`, { error });
		}
	}
);

// Catch undefined routes (404) and render generic 404 not found page
app.use((request, response) => {
	pino.warn(`[WEB] Page ${response.req.originalUrl} does not exist. Render 404 page`);
	response.status(404).render('app/404');
});

export { app };
