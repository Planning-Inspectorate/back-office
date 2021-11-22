const { getAppealDetails } = require('../controllers/appeal-details');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/appeal-details', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-details');

    expect(mockGet).toBeCalledWith('/', getAppealDetails);
  });
});
