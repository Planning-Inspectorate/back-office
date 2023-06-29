import { installRequestLocalsMiddleware } from '@pins/express';
import config from '@pins/applications.web/environment/config.js';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csurf from 'csurf';
import express from 'express';
import requestID from 'express-request-id';
import helmet from 'helmet';
import multer from 'multer';
import responseTime from 'response-time';
import serveStatic from 'serve-static';
import pino from '../lib/logger.js';
import { msalMiddleware } from '../lib/msal.js';
import appRouter from './app.router.js';
import locals from './config/locals.js';
import nunjucksEnvironment from './config/nunjucks.js';
import session from './config/session.js';

// Create a new Express app.
const app = express();

app.use(installRequestLocalsMiddleware());

app.use((request, response, next) => {
	response.setHeader('Cache-Control', 'no-cache, max-age=0');
	response.setHeader(
		'Permissions-Policy',
		'accelerometer=(),ambient-light-sensor=(),autoplay=(),battery=(),camera=(),' +
			'display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),gamepad=(),geolocation=(),gyroscope=(),' +
			'layout-animations=(self),legacy-image-formats=(self),magnetometer=(),microphone=(),midi=(),oversized-images=(self),' +
			'payment=(),picture-in-picture=(),publickey-credentials-get=(),speaker-selection=(),sync-xhr=(self),unoptimized-images=(self),' +
			'unsized-media=(self),usb=(),screen-wake-lock=(),web-share=(),xr-spatial-tracking=()'
	);
	next();
});

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

// Secure apps by setting various HTTP headers
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			scriptSrc: ["'self'", () => `'nonce-${locals.cspNonce}'`],
			defaultSrc: ["'self'", config.blobStorageUrl],
			'font-src': ["'self'"],
			'img-src': ["'self'", config.blobStorageUrl],
			'style-src': [
				"'self'",
				// the hashes below are for the toastui editor, used for rich-text editing
				// allowing specific styles by hash is still safe enough
				"'unsafe-hashes'",
				"'sha256-ZdHxw9eWtnxUb3mk6tBS+gIiVUPE3pGM470keHPDFlE='",
				"'sha256-dCNOmK/nSY+12vHzasLXiswzlGT5UHA7jAGYkvmCuQs='",
				"'sha256-aqNNdDLnnrDOnTNdkJpYlAxKVJtLt9CtFLklmInuUAE='"
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

// MSAL middleware
app.use(msalMiddleware);

// Session middleware
app.use(session);

// CSRF middleware via session
app.use(
	// where request uses multipart form body, then extract csrf token before verifying it
	// @ts-ignore – Multer cannot be a string
	multer(),
	csurf({ cookie: false }),
	(request, response, next) => {
		response.locals.csrfToken = request.csrfToken();
		next();
	}
);

// Set the express view engine to nunjucks.
nunjucksEnvironment.express(app);
app.set('view engine', 'njk');

// Serve static files (fonts, images, generated CSS and JS, etc)
app.use(serveStatic('src/server/static'));
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
