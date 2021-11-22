const { getAppealSearchResults } = require('../controllers/appeal-search-results');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/appeal-search-results', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-search-results');

    expect(mockGet).toBeCalledWith('/:searchString', getAppealSearchResults);
  });
});
