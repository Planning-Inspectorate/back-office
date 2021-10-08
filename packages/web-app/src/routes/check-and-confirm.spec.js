const { getCheckAndConfirm, postCheckAndConfirm } = require('../controllers/check-and-confirm');
const { mockGet, mockPost } = require('../../test/utils/mocks');
const { checkAndConfirmValidation } = require('../validation/check-and-confirm');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');
const getCaseData = require('../lib/get-case-data');

jest.mock('../validation/check-and-confirm');
jest.mock('../lib/express-validation-errors-to-govuk-error-list');

describe('routes/check-and-confirm', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./check-and-confirm');

    expect(mockGet).toBeCalledWith(``, getCaseData, getCheckAndConfirm);
    expect(mockPost).toBeCalledWith(
      ``,
      getCaseData,
      checkAndConfirmValidation(),
      expressValidationErrorsToGovUkErrorList,
      postCheckAndConfirm
    );
  });
});
