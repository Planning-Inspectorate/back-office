const { getReviewQuestionnaireComplete } = require('../controllers/review-questionnaire-complete');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/review-questionnaire-complete', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./review-questionnaire-complete');

    expect(mockGet).toBeCalledWith('/', getReviewQuestionnaireComplete);
  });
});
