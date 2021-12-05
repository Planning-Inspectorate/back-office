const {
  getCaseOfficerDetails,
  postCaseOfficerDetails,
} = require('../../controllers/appeal-details/case-officer');
const { mockGet, mockPost } = require('../../../test/utils/mocks');
const { rules: caseOfficerRules } = require('../../validation/appeal-details/case-officer-details');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../../validation/appeal-details/case-officer-details');
jest.mock('../../lib/express-validation-errors-to-govuk-error-list');

describe('routes/appeal-details/case-officer', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./case-officer');

    expect(mockGet).toBeCalledWith('/', getCaseOfficerDetails);
    expect(mockPost).toBeCalledWith(
      '/',
      [caseOfficerRules(), expressValidationErrorsToGovUkErrorList],
      postCaseOfficerDetails
    );
  });
});
