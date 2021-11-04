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
});
