require('dotenv').config();

const config = {
  application: {
    defaultDateFormat: 'DD MMMM YYYY',
  },
  documents: {
    timeout: Number(process.env.DOCUMENTS_SERVICE_API_TIMEOUT || 10000),
    url: process.env.DOCUMENTS_SERVICE_API_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['opts.body'],
  },
  server: {
    port: process.env.PORT || 3000,
  },
  sso: {
    auth: {
      clientId: process.env.AUTH_CLIENT_ID,
      cloudInstanceId: process.env.AUTH_CLOUD_INSTANCE_ID,
      tenantId: process.env.AUTH_TENANT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    },
    redirectUri: process.env.AUTH_REDIRECT_URI,
  },
};

module.exports = config;
