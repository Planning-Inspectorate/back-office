const { getAppealAlreadyReviewed } = require('../controllers/appeal-already-reviewed');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/appeal-already-reviewed', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-already-reviewed');

    expect(mockGet).toBeCalledWith('/', getAppealAlreadyReviewed);
  });
});
