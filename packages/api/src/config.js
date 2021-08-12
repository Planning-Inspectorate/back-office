const path = require('path');

const config = {
  docs: {
    api: {
      path: process.env.DOCS_API_PATH || path.join(__dirname, '..', 'api'),
    },
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
