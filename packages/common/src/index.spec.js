const index = require('./index');
const functional = require('./functional');
const healthcheck = require('./health');
const prometheus = require('./prometheus');
const utils = require('./utils');

describe('index', () => {
  it('should expose the underlying modules', () => {
    expect(index).toEqual({
      utils,
      functional,
      healthcheck,
      prometheus,
    });
  });
});
