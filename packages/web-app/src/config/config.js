const config = {
  application: {
    defaultDateFormat: 'DD MMMM YYYY',
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['opts.body'],
  },
  server: {
    port: process.env.PORT || 3000,
  },
};

module.exports = config;
