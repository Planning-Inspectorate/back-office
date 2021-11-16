const { getCheckAndConfirm, setCheckAndConfirm } = require('./questionnaire-check-and-confirm');
const { reviewQuestionnaireSubmission: previousPage } = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/questionnaire-check-and-confirm', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getCheckAndConfirm', () => {
    it('should render the view with data correctly', async () => {
      const { questionnaire } = req.session;

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        pageTitle: 'Review questionnaire',
        previousPage: `${previousPage}/${questionnaire.appealId}`,
        questionnaireData: questionnaire,
        reviewOutcome: questionnaire.outcome,
      });
    });
  });

  describe('setCheckAndConfirm', () => {
    it('should redirect to review outcome page', async () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'COMPLETE',
            missingOrIncorrectDocuments: undefined,
          },
        },
        params: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
      };

      await setCheckAndConfirm(req, res);

      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(
        `/review-questionnaire-submission/${req.params.appealId}`
      );
    });
  });
});
