const { healthcheck } = require('@pins/common');
const logger = require('./logger');

const healthchecks = (server) =>
  healthcheck({
    server,
    logger,
    tasks: [],
  });

module.exports = healthchecks;
