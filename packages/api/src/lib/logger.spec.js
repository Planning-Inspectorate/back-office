const pino = require('pino');
const config = require('../config');

const {
  logger: { level, redact },
} = config;

jest.mock('pino');

describe('lib/logger', () => {
  it('should configure the logger correctly', () => {
    // eslint-disable-next-line global-require
    require('./logger');

    expect(pino).toBeCalledWith({
      level,
      redact,
    });
  });
});
