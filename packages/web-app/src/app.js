require('dotenv').config();

const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const pinoExpress = require('express-pino-logger');
const { v4: uuidV4 } = require('uuid');
const { prometheus } = require('@pins/common');
const { sso } = require('pins-sso');
const logger = require('./lib/logger');
const routes = require('./routes');
const config = require('./config/config');
const getCaseData = require('./lib/get-case-data');

const app = express();
const {
  application: { defaultDateFormat },
} = config;

prometheus.init(app);

app.use(
  pinoExpress({
    logger,
    genReqId: () => uuidV4(),
  })
);

const isDev = app.get('env') === 'development';

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  watch: isDev,
  express: app,
};

const viewPaths = [
  path.join(__dirname, '..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, 'views'),
];

const env = nunjucks.configure(viewPaths, nunjucksConfig);

dateFilter.setDefaultFormat(defaultDateFormat);
env.addFilter('date', dateFilter);

app.use((req, res, next) => {
  env.addGlobal('previousPage', req.headers.referer);
  next();
});
app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'assets'))
);
app.use(
  '/assets/govuk/all.js',
  express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'all.js'))
);

app.use(getCaseData);

sso(app, config.sso, logger);

app.use('/', routes);
app.set('view engine', 'njk');
app
  .use((req, res, next) => {
    res.status(404).render('error/not-found');
    next();
  })
  .use((err, req, res, next) => {
    logger.error({ err }, 'Unhandled exception');

    res.status(500).render('error/unhandled-exception');
    next();
  });

module.exports = app;
