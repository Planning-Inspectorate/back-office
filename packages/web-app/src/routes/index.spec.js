const appealsList = require('./appeals-list');
const home = require('./home');
const reviewAppealSubmission = require('./review-appeal-submission');
const validAppealDetails = require('./valid-appeal-details');
const invalidAppealDetails = require('./invalid-appeal-details');
const missingOrWrongDetails = require('./missing-or-wrong');
const { mockUse } = require('../../test/utils/mocks');
const documentsServiceProxyRouter = require('./document-service-proxy');

describe('routes/index', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toBeCalledTimes(7);
    expect(mockUse).toBeCalledWith('/', appealsList);
    expect(mockUse).toBeCalledWith('/', home);
    expect(mockUse).toBeCalledWith('/', reviewAppealSubmission);
    expect(mockUse).toBeCalledWith('/', validAppealDetails);
    expect(mockUse).toBeCalledWith('/', invalidAppealDetails);
    expect(mockUse).toBeCalledWith('/', missingOrWrongDetails);
    expect(mockUse).toBeCalledWith('/document', documentsServiceProxyRouter);
  });
});
