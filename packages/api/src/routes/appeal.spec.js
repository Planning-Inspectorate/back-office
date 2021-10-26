const { getAppeal, postAppeal } = require('../controllers/appeal');
const { mockGet, mockPost } = require('../../test/utils/mocks');

describe('routes/appeal', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./appeal');

    expect(mockGet).toHaveBeenCalledWith('/', getAppeal);
    expect(mockPost).toHaveBeenCalledWith('/', postAppeal);
  });
});
