const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('../controllers/review-appeal-submission');
const views = require('../config/views');
const { get, post } = require('../test/router-mock');
const reviewOutcomeValidation = require('../validation/review-outcome');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../validation/review-outcome');
jest.mock('../lib/express-validation-errors-to-govuk-error-list');

describe('routes/review-appeal-submission', () => {
  it('should define the correct routes', () => {
    // eslint-disable-next-line global-require
    require('./review-appeal-submission');

    expect(get).toBeCalledWith(`/${views.reviewAppealSubmission}`, getReviewAppealSubmission);
    expect(post).toBeCalledWith(
      `/${views.reviewAppealSubmission}`,
      reviewOutcomeValidation(),
      expressValidationErrorsToGovUkErrorList,
      postReviewAppealSubmission
    );
  });
});
