const {
  reviewQuestionnaireComplete: currentPage,
  home: dashboard,
  questionnairesList,
} = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { getReviewQuestionnaireComplete } = require('./review-questionnaire-complete');

describe('controller/review-questionnaire-complete', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('review-questionnaire-complete', () => {
    it('should render the view with correct staus - Complete, if questionnaire review outcome is complete', () => {
      req = {
        session: {
          appeal: { id: appealId, horizonId },
          questionnaire: { missingOrIncorrectDocuments: 0 },
        },
      };

      const viewData = () => ({
        pageTitle: 'Review complete',
        hidePageTitle: 'true',
        dashboardLink: dashboard,
        questionnairesListLink: questionnairesList,
      });

      const options = {
        ...viewData(),
        appealData: req.session.appeal,
        questionnaireData: req.session.questionnaire,
      };

      getReviewQuestionnaireComplete(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, options);
    });
  });
});
