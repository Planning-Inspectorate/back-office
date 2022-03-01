"use strict";

const path = require("node:path");
const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const compress = require("compression");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const serveStatic = require('serve-static');
const helmet = require("helmet");
const { routes } = require("./routes");
const app = express();
const stripQueryParamsDev = require('../lib/filters/strip-query-params-dev');
const resourceCSS = require('../_data/resourceCSS.json');

// if (config.env === 'development') {
// 	app.use(logger('dev'));
// }

const viewPaths = [
	// TODO: Use NodeResolveLoader instead of this hack.
	// https://mozilla.github.io/nunjucks/api.html
	// https://github.com/mozilla/nunjucks/pull/1197/files
	path.resolve(require.resolve("govuk-frontend"), "../.."),
	path.join(__dirname, "../views"),
];
const env = nunjucks.configure(viewPaths, {
	autoescape: true,
	express: app,
});

env.addFilter('stripQueryParamsDev', stripQueryParamsDev);
env.addGlobal('resourceCSS', resourceCSS);

app.set("view engine", "njk");

// Don't cache HTML files for local dev
const cacheHeaders = (response, requestPath) => {
	if (serveStatic.mime.lookup(requestPath) === 'text/html') {
		// Custom Cache-Control for HTML files
		response.setHeader('Cache-Control', 'public, max-age=0');
		response.setHeader('Document-Policy', 'js-profiling');
	}
};

app.use(serveStatic('src/server/static', { maxAge: '1h', setHeaders: cacheHeaders }));

app.use("/", routes);

module.exports = {
	app,
};
