"use strict";

const path = require("node:path");
const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const compression = require("compression");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const serveStatic = require("serve-static");
const helmet = require("helmet");
const { routes } = require("./routes");
const { config } = require("../config/config");
const stripQueryParametersDevelopment = require("../lib/filters/strip-query-params");
const resourceCSS = require("../_data/resourceCSS.json");

// Create a new Express app.
const app = express();

if (!config.isProd) {
	app.use(logger("dev"));
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
				"'self'",
				() => `'nonce-EdcOUaJ8lczj9tIPO0lPow=='`,
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
	path.resolve(require.resolve("govuk-frontend"), "../.."),
	path.join(__dirname, "../views"),
];

const njEnvironment = nunjucks.configure(viewPaths, {
	autoescape: true,
	express: app,
});

njEnvironment.addFilter("stripQueryParamsDev", stripQueryParametersDevelopment);
njEnvironment.addGlobal("resourceCSS", resourceCSS);
njEnvironment.addGlobal("cspNonce", "EdcOUaJ8lczj9tIPO0lPow==");

app.set("view engine", "njk");

// Serve static files (fonts, images, generated CSS and JS, etc)
app.use(serveStatic("src/server/static"));

app.use("/", routes);

module.exports = {
	app,
};
