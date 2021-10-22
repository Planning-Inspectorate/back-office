const handleQuestionnaireAlreadyReviewed = require('./handle-questionnaire-already-reviewed');
const { mockReq, mockRes, mockNext: next } = require('../../test/utils/mocks');
const views = require('../config/views');

describe('lib/handle-questionnaire-already-reviewed', () => {
  const res = mockRes();
  let req;

  beforeEach(() => {
    req = {
      ...mockReq,
    };
  });

  it(`should redirect to /${views.questionnaireAlreadyReviewed} if req.session.appeal.state is not 'Questionnaire Received'`, () => {
    req.session = {
      questionnaire: {
        state: 'Questionnaire Submitted',
      },
    };

    handleQuestionnaireAlreadyReviewed(req, res, next);
    expect(res.redirect).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledWith(`/${views.questionnaireAlreadyReviewed}`);
  });

  it('should call next if req.session.appeal.state is `Questionnaire Received`', () => {
    req.session = {
      questionnaire: {
        state: 'Questionnaire Received',
      },
    };

    handleQuestionnaireAlreadyReviewed(req, res, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });

  it('should call next if req.session.appeal.state is not set', () => {
    req.session.questionnaire = {};

    handleQuestionnaireAlreadyReviewed(req, res, next);
    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });
});
