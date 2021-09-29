const { getMissingOrWrong, postMissingOrWrong } = require('../controllers/missing-or-wrong');
const views = require('../config/views');
const { mockGet, mockPost } = require('../../test/utils/mocks');
const { missingOrWrongAppealDetailsValidation } = require('../validation/missing-or-wrong');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../validation/missing-or-wrong');
jest.mock('../lib/express-validation-errors-to-govuk-error-list');

describe('routes/missing-or-wrong', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./missing-or-wrong');

    expect(mockGet).toBeCalledWith(`/${views.missingOrWrong}`, getMissingOrWrong);
    expect(mockPost).toBeCalledWith(
      `/${views.missingOrWrong}`,
      missingOrWrongAppealDetailsValidation(),
      expressValidationErrorsToGovUkErrorList,
      postMissingOrWrong
    );
  });
});
