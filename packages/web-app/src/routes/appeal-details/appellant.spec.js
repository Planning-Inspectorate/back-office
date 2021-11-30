const {
  getAppellantDetails,
  postAppellantDetails,
} = require('../../controllers/appeal-details/appellant');
const { mockGet, mockPost } = require('../../../test/utils/mocks');
const { rules: yourDetailsRules } = require('../../validation/appeal-details/appellant-details');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../../validation/appeal-details/appellant-details');
jest.mock('../../lib/express-validation-errors-to-govuk-error-list');

describe('routes/appeal-details/appellant', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./appellant');

    expect(mockGet).toBeCalledWith('/', getAppellantDetails);
    expect(mockPost).toBeCalledWith(
      '/',
      [yourDetailsRules(), expressValidationErrorsToGovUkErrorList],
      postAppellantDetails
    );
  });
});
