import path from 'path';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import express from 'express';
import nunjucks from 'nunjucks';
import morganLogger from 'morgan';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import serveStatic from 'serve-static';
import helmet from 'helmet';
import requestID from 'express-request-id';
import responseTime from 'response-time';
import session from 'express-session';
import { __dirname } from '../lib/helpers.js';
import { routes } from './routes.js';
import { config } from '../config/config.js';
import stripQueryParametersDevelopment from '../lib/nunjucks-filters/strip-query-parameters.js';

const resourceCSS = JSON.parse(await readFile(new URL('../_data/resourceCSS.json', import.meta.url)));
const resourceJS = JSON.parse(await readFile(new URL('../_data/resourceJS.json', import.meta.url)));
const require = createRequire(import.meta.url);

// Create a new Express app.
const app = express();

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
app.use(session({
	secret: 'PINSBackOffice',
	resave: false,
	saveUninitialized: true
}));

// Nunjucks templating engine settings and configuration.
const viewPaths = [
	// TODO: Try and use NodeResolveLoader instead of this hack.
	// https://mozilla.github.io/nunjucks/api.html
	// https://github.com/mozilla/nunjucks/pull/1197/files
	path.resolve(require.resolve('govuk-frontend'), '../..'),
	path.join(__dirname, '../views')
];

const njEnvironment = nunjucks.configure(viewPaths, {
	autoescape: true,
	express: app
});

njEnvironment.addFilter('stripQueryParamsDev', stripQueryParametersDevelopment);
njEnvironment.addGlobal('isProd', config.isProd);
njEnvironment.addGlobal('isRelease', config.isRelease);
njEnvironment.addGlobal('resourceCSS', resourceCSS);
njEnvironment.addGlobal('resourceJS', resourceJS);
njEnvironment.addGlobal('cspNonce', 'EdcOUaJ8lczj9tIPO0lPow==');

// Set the express view engine to NJK.
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
app.use((error, request, response, next) => {
	if (response.headersSent) {
		next(error);
	}

	response.status(500);
	response.render('app/error', { error: error });
});

// Catch undefined routes (404) and render generic 404 not found page
app.use((request, response) => {
	response.status(404).render('app/404');
});

export { app };
