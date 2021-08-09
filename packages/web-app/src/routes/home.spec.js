const getHome = require('../controllers/home');
const views = require('../config/views');
const { get } = require('../test/router-mock');

describe('routes/home', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./home');
    expect(get).toBeCalledWith(`/${views.home}`, getHome);
  });
});
