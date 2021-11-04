const {
  getReviewQuestionnaire,
  postReviewQuestionnaire,
} = require('../controllers/review-questionnaire');

const { rules: reviewQuestionnaireValidationRules } = require('../validation/review-questionnaire');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

jest.mock('../validation/review-questionnaire');

const { mockGet, mockPost } = require('../../test/utils/mocks');

describe('routes/questionnaires-for-review/review', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./review-questionnaire');
    expect(mockGet).toBeCalledWith(`/`, getReviewQuestionnaire);
    expect(mockPost).toBeCalledWith(
      `/`,
      reviewQuestionnaireValidationRules(),
      expressValidationErrorsToGovUkErrorList,
      postReviewQuestionnaire
    );
  });
});
