const { getQuestionnaireAlreadySubmitted } = require('./questionnaire-already-reviewed');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/questionnaire-already-reviewed', () => {
  let req;
  let res;
  let expectedViewData;

  beforeEach(() => {
    req = {
      ...mockReq,
      ...{
        session: {
          casework: {
            caseOfficer: {
              name: 'Sally Smith',
            },
          },
        },
      },
    };
    res = mockRes();
    expectedViewData = {
      ...{
        pageTitle: 'Questionnaire already reviewed',
        caseOfficerName: 'Sally Smith',
      },
    };
  });

  describe('getQuestionnaireAlreadyReviewed', () => {
    it('should render the view with data correctly when questionnaire is already reviewed', () => {
      getQuestionnaireAlreadySubmitted(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.questionnaireAlreadyReviewed, expectedViewData);
      expect(res.redirect).not.toBeCalled();
    });

    /* it('should redirect to the appeals list when the case officer name is not set', () => {
      delete req.session.casework.caseOfficer;

      getQuestionnaireAlreadySubmitted(req, res);

      expect(res.render).not.toBeCalled();
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${views.questionnairesList}`);
    }); */
  });
});
