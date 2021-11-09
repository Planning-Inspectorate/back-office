const {
  getReviewQuestionnaireSubmission,
  postReviewQuestionnaireSubmission,
} = require('../controllers/review-questionnaire-submission');

const {
  rules: reviewQuestionnaireValidationRules,
} = require('../validation/review-questionnaire-submission');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../validation/review-questionnaire-submission');

const { mockGet, mockPost } = require('../../test/utils/mocks');

describe('routes/questionnaires-for-review/review', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./review-questionnaire-submission');
    expect(mockGet).toBeCalledWith(`/`, getReviewQuestionnaireSubmission);
    expect(mockPost).toBeCalledWith(
      `/`,
      reviewQuestionnaireValidationRules(),
      expressValidationErrorsToGovUkErrorList,
      postReviewQuestionnaireSubmission
    );
  });
});
