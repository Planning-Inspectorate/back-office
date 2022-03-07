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
import { __dirname } from '../lib/helpers.js';
import { routes } from './routes.js';
import { config } from '../config/config.js';
import stripQueryParametersDevelopment from '../lib/nunjucks-filters/strip-query-parameters.js';
// import resourceCSS from '../_data/resourceCSS.json' assert { type: 'json' };
// import resourceJS from '../_data/resourceJS.json' assert { type: 'json' };

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
				() => `'nonce-EdcOUaJ8lczj9tIPO0lPow=='`, // eslint-disable-line quotes
			],
		},
	})
);

// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Enable compression middleware
app.use(compression());

// Nunjucks templating engine settings and configuration.
const viewPaths = [
	// TODO: Try and use NodeResolveLoader instead of this hack.
	// https://mozilla.github.io/nunjucks/api.html
	// https://github.com/mozilla/nunjucks/pull/1197/files
	path.resolve(require.resolve('govuk-frontend'), '../..'),
	path.join(__dirname, '../views'),
];

const njEnvironment = nunjucks.configure(viewPaths, {
	autoescape: true,
	express: app,
});

njEnvironment.addFilter('stripQueryParamsDev', stripQueryParametersDevelopment);
njEnvironment.addGlobal('resourceCSS', resourceCSS);
njEnvironment.addGlobal('resourceJS', resourceJS);
njEnvironment.addGlobal('cspNonce', 'EdcOUaJ8lczj9tIPO0lPow==');

app.set('view engine', 'njk');

// Serve static files (fonts, images, generated CSS and JS, etc)
app.use(serveStatic('src/server/static'));

// Mount all routes on / path.
// All the other subpaths will be defined in the `routes.js` file.
app.use('/', routes);

export {
	app
};
