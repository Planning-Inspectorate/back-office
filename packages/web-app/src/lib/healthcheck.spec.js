const common = require('@pins/common');
const healthcheck = require('./healthcheck');
const logger = require('./logger');

jest.mock('@pins/common');

describe('lib/healthcheck', () => {
  it('should configure the healthcheck correctly', () => {
    const server = jest.fn();

    expect(healthcheck(server)).toBe(undefined);

    expect(common.healthcheck).toBeCalledWith({
      server,
      logger,
      tasks: [],
    });
  });
});
