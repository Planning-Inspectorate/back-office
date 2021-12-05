const { getAppealDetails } = require('../controllers/appeal-details');
const { mockUse } = require('../../test/utils/mocks');
const getCaseData = require('../lib/get-case-data');
const appellantRouter = require('./appeal-details/appellant');
const caseOfficerRouter = require('./appeal-details/case-officer');

describe('routes/appeal-details', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-details');

    expect(mockUse).toBeCalledTimes(3);
    expect(mockUse).toBeCalledWith('/:appealId/appellant', getCaseData, appellantRouter);
    expect(mockUse).toBeCalledWith('/:appealId/case-officer', getCaseData, caseOfficerRouter);
    expect(mockUse).toBeCalledWith('/:appealId', getCaseData, getAppealDetails);
  });
});
