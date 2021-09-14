const appealsList = require('./appeals-list');
const home = require('./home');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/index', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toBeCalledTimes(4);
    expect(mockUse).toBeCalledWith('/', appealsList);
    expect(mockUse).toBeCalledWith('/', home);
    expect(mockUse).toBeCalledWith('/', reviewAppealSubmission);
    expect(mockUse).toBeCalledWith('/', validAppealDetails);
  });
});
