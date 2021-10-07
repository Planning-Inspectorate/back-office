const {
  getValidAppealDetails,
  postValidAppealDetails,
} = require('../controllers/valid-appeal-details');
const { mockGet, mockPost } = require('../../test/utils/mocks');
const validAppealDetailsValidation = require('../validation/valid-appeal-details');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../validation/valid-appeal-details');
jest.mock('../lib/express-validation-errors-to-govuk-error-list');

describe('routes/valid-appeal-details', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./valid-appeal-details');

    expect(mockGet).toBeCalledWith('/', getValidAppealDetails);
    expect(mockPost).toBeCalledWith(
      '/',
      validAppealDetailsValidation(),
      expressValidationErrorsToGovUkErrorList,
      postValidAppealDetails
    );
  });
});
