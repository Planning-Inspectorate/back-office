const {
  getSiteAddress,
  postSiteAddress,
} = require('../../controllers/appeal-details/site-address');
const { mockGet, mockPost } = require('../../../test/utils/mocks');
const {
  rules: siteLocationValidationRules,
} = require('../../validation/appeal-details/site-location');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../../validation/appeal-details/site-location');
jest.mock('../../lib/express-validation-errors-to-govuk-error-list');

describe('routes/appeal-details/site-address', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./site-address');

    expect(mockGet).toBeCalledWith('/', getSiteAddress);
    expect(mockPost).toBeCalledWith(
      '/',
      [siteLocationValidationRules(), expressValidationErrorsToGovUkErrorList],
      postSiteAddress
    );
  });
});
