const {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
} = require('../controllers/invalid-appeal-details');
const { mockGet, mockPost } = require('../../test/utils/mocks');
const { invalidAppealDetailsValidation } = require('../validation/invalid-appeal-details');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../validation/invalid-appeal-details');
jest.mock('../lib/express-validation-errors-to-govuk-error-list');

describe('routes/invalid-appeal-details', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./invalid-appeal-details');

    expect(mockGet).toBeCalledWith('/', getInvalidAppealDetails);
    expect(mockPost).toBeCalledWith(
      '/',
      invalidAppealDetailsValidation(),
      expressValidationErrorsToGovUkErrorList,
      postInvalidAppealDetails
    );
  });
});
