const getHome = require('../controllers/home');
const views = require('../config/views');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/home', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./home');
    expect(mockGet).toBeCalledWith(`/${views.home}`, getHome);
  });
});
