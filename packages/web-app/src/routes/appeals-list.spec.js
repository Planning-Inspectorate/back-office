const getAppealsList = require('../controllers/appeals-list');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/appeals-list', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeals-list');

    expect(mockGet).toBeCalledWith('/', getAppealsList);
  });
});
