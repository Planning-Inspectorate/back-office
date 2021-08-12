const express = require('express');
const pinoExpress = require('express-pino-logger');
const compression = require('compression');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { prometheus } = require('@pins/common');
const logger = require('./lib/logger');
const routes = require('./routes');
const notFound = require('./controllers/not-found');

const app = express();

prometheus.init(app);

app.use(
  pinoExpress({
    logger,
    genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4(),
  })
);
app.use(bodyParser.json());
app.use(compression());
app.use('/', routes);
app.use(notFound);

module.exports = app;
