const { postAppealSubmission } = require('../controllers/appeal-submission');
const { mockPost } = require('../../test/utils/mocks');

describe('routes/appeal-submission', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./appeal-submission');

    expect(mockPost).toHaveBeenCalledWith('/', postAppealSubmission);
  });
});
