const { postAppealLink } = require('../controllers/appeal-link');
const { mockPost } = require('../../test/utils/mocks');

describe('routes/appeal-link', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./appeal-link');

    expect(mockPost).toHaveBeenCalledWith('/', postAppealLink);
  });
});
