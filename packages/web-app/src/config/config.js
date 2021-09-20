require('dotenv').config();

const config = {
  application: {
    defaultDateFormat: 'DD MMMM YYYY',
  },
  db: {
    session: {
      uri: process.env.SESSION_MONGODB_URL,
      databaseName: process.env.SESSION_MONGODB_DB_NAME,
      collection: process.env.SESSION_MONGODB_COLLECTION || 'sessions',
      expiresColumn: '_ts',
      expires: 1000 * 60 * 60 * 24 * 14, // value in milliseconds
      expiresAfterSeconds: 60 * 60 * 24 * 14, // value in seconds
      connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
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
    sessionSecret: process.env.SESSION_KEY || 'somethingreallysecret',
    useSecureSessionCookie: process.env.USE_SECURE_SESSION_COOKIES === 'true',
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
