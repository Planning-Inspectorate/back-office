  const { getCheckAndConfirm } = require('./questionnaire-check-and-confirm');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/questionnaire-check-and-confirm', () => {
  const questionnaireData = {
    caseReference: 'ABC/123/12345',
  };

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getCheckAndConfirm', () => {
    it('should render the view with data correctly', async () => {
      req.session.questionnaire = questionnaireData;

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        pageTitle: 'Review questionnaire',
        questionnaireData,
        reviewOutcome: 'Incomplete',
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
      checkAndConfirmController.postCheckAndConfirm(req, res);

      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${nextPage}`);
    });
  });
});
