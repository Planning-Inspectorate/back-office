const getAppealsList = require('../controllers/appeals-list');
const views = require('../config/views');
const { get } = require('../test/router-mock');

describe('routes/appeals-list', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeals-list');
    expect(get).toBeCalledWith(`/${views.appealsList}`, getAppealsList);
  });
});
