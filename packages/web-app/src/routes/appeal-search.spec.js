const { getAppealSearch, postAppealSearch } = require('../controllers/appeal-search');
const { mockGet, mockPost } = require('../../test/utils/mocks');

describe('routes/appeal-search', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-search');

    expect(mockGet).toBeCalledWith('/', getAppealSearch);
    expect(mockPost).toBeCalledWith('/', postAppealSearch);
  });
});
