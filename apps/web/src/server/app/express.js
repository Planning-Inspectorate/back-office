'use strict';

const path = require('node:path');
const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const compress = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { routes } = require('./routes');
const app = express();

// if (config.env === 'development') {
// 	app.use(logger('dev'));
// }

const viewPaths = [
	// TODO: Use NodeResolveLoader instead of this hack.
	// https://mozilla.github.io/nunjucks/api.html
	// https://github.com/mozilla/nunjucks/pull/1197/files
	path.resolve(require.resolve('govuk-frontend'), '../..'),
	path.join(__dirname, '../views')
];
const env = nunjucks.configure(viewPaths, {
	autoescape: true,
	express: app,
});

app.set('view engine', 'njk');

app.use('/', routes);

module.exports = {
	app,
};
