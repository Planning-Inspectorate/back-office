const { getAppealDetails } = require('../controllers/appeal-details');
const { mockUse } = require('../../test/utils/mocks');
const getCaseData = require('../lib/get-case-data');
const appellantRouter = require('./appeal-details/appellant');
const caseOfficerRouter = require('./appeal-details/case-officer');
const applicationDecisionDateRouter = require('./appeal-details/application-decision-date');
const siteAddressRouter = require('./appeal-details/site-address');

describe('routes/appeal-details', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appeal-details');

    expect(mockUse).toBeCalledTimes(5);
    expect(mockUse).toBeCalledWith('/:appealId', getCaseData, getAppealDetails);
    expect(mockUse).toBeCalledWith('/:appealId/appellant', getCaseData, appellantRouter);
    expect(mockUse).toBeCalledWith(
      '/:appealId/application-decision-date',
      getCaseData,
      applicationDecisionDateRouter
    );
    expect(mockUse).toBeCalledWith('/:appealId/site-address', getCaseData, siteAddressRouter);
    expect(mockUse).toBeCalledWith('/:appealId/case-officer', getCaseData, caseOfficerRouter);
  });
});
