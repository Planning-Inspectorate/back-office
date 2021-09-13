const connectMongodb = require('connect-mongodb-session');
const session = require('express-session');
const logger = require('./logger');

const sessionConfig = (sessionSecret, useSecureSessionCookie, dbConfig) => {
  if (!sessionSecret) {
    throw new Error('Session secret must be set');
  }

  const MongoDBStore = connectMongodb(session);
  const store = new MongoDBStore(dbConfig);

  /* istanbul ignore next */
  store.on('error', (err) => {
    logger.error({ err }, 'MongoDB session store error');
  });

  return {
    store,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: useSecureSessionCookie,
    },
  };
};

module.exports = sessionConfig;
