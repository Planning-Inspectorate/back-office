const connectMongodb = require('connect-mongodb-session');
const session = require('express-session');
const sessionConfig = require('./session-config');

jest.mock('connect-mongodb-session', () =>
  jest.fn().mockImplementation(
    () =>
      class MongoDBStore {
        on() {
          return this;
        }
      }
  )
);

describe('lib/sessionConfig', () => {
  let sessionSecret = 'somethingreallysecret';
  const useSecureSessionCookie = 'false';
  const dbConfig = {};

  describe('sessionConfig', () => {
    it('should return the correct data', () => {
      const MongoDBStore = connectMongodb(session);
      const store = new MongoDBStore(dbConfig);

      const result = sessionConfig(sessionSecret, useSecureSessionCookie, dbConfig);

      expect(result).toEqual({
        store,
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: useSecureSessionCookie,
        },
      });
    });

    it('should throw an error if sessionSecret is not set', () => {
      sessionSecret = undefined;

      try {
        sessionConfig(sessionSecret, useSecureSessionCookie, dbConfig);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Session secret must be set');
      }
    });
  });
});
