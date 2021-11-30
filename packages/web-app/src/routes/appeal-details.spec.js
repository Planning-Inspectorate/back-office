const { getAppealDetails } = require('../controllers/appeal-details');
const { mockUse } = require('../../test/utils/mocks');
const getCaseData = require('../lib/get-case-data');
const appellantRouter = require('./appeal-details/appellant');

describe('routes/appeal-details', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-details');

    expect(mockUse).toBeCalledTimes(2);
    expect(mockUse).toBeCalledWith('/:appealId/appellant', getCaseData, appellantRouter);
    expect(mockUse).toBeCalledWith('/:appealId', getCaseData, getAppealDetails);
  });
});
