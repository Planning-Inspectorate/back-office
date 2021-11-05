const path = require('path');

const config = {
  documentation: {
    api: {
      path: process.env.DOCUMENTATION_API_PATH || path.join(__dirname, '..', 'api'),
    },
  },
  documents: {
    url: process.env.DOCUMENTS_SERVICE_API_URL,
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
