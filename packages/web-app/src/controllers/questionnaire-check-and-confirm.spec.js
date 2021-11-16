const { getCheckAndConfirm, postCheckAndConfirm } = require('./questionnaire-check-and-confirm');
const {
  reviewQuestionnaireSubmission: previousPage,
  reviewQuestionnaireComplete: nextPage,
} = require('../config/views');
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
      const { appeal, questionnaire } = req.session;

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        pageTitle: 'Review questionnaire',
        previousPage: `${previousPage}/${questionnaire.appealId}`,
        appealReference: appeal.caseReference,
        questionnaireData: questionnaire,
        reviewOutcome: questionnaire.outcome,
      });
    });
  });

  describe('postCheckAndConfirm', () => {
    it('should redirect to review outcomepage', () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'COMPLETE',
            missingOrIncorrectDocuments: [],
          },
        },
      };

      postCheckAndConfirm(req, res);

      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${nextPage}`);
    });
  });
});
