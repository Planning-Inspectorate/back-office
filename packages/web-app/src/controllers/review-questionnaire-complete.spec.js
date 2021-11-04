const { reviewQuestionnaireComplete: currentPage, questionnairesList } = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { getReviewQuestionnaireComplete } = require('./review-questionnaire-complete');

describe('controllers/review-questionnaire-complete', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getReviewQuestionnaireComplete', () => {
    it('should render the view with correct staus - Complete, if questionnaire review outcome is complete', () => {
      req = {
        session: {
          appeal: { id: appealId, horizonId },
          questionnaire: { outcome: 'complete' },
        },
      };

      const viewData = () => ({
        pageTitle: 'Review complete',
        hidePageTitle: 'true',
        questionnairesListLink: questionnairesList,
      });

      const options = {
        ...viewData(),
        appealData: req.session.appeal,
        outcome: 'complete',
      };

      getReviewQuestionnaireComplete(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, options);
    });
  });
});
