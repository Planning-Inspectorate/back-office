const appealsList = require('./appeals-list');
const home = require('./home');
const { use } = require('../test/router-mock');

describe('routes/index', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./index');
    expect(use).toBeCalledTimes(2);
    expect(use).toBeCalledWith('/', appealsList);
    expect(use).toBeCalledWith('/', home);
  });
});
