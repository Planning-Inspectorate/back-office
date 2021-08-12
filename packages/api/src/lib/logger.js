const pino = require('pino');
const config = require('../config');

const {
  logger: { level, redact },
} = config;

const logger = pino({
  level,
  redact,
});

module.exports = logger;
