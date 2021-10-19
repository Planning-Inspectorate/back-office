const { getReviewComplete } = require('../controllers/review-complete');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/review-complete', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./review-complete');

    expect(mockGet).toBeCalledWith('/', getReviewComplete);
  });
});
