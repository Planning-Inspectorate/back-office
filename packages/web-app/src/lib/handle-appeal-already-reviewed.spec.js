const handleAppealAlreadyReviewed = require('./handle-appeal-already-reviewed');
const { mockReq, mockRes, mockNext: next } = require('../../test/utils/mocks');
const views = require('../config/views');

describe('lib/handle-appeal-already-reviewed', () => {
  const res = mockRes();

  let req;

  beforeEach(() => {
    req = {
      ...mockReq,
    };
  });

  it(`should redirect to /${views.appealAlreadyReviewed} if req.session.appeal.state is not 'Appeal Received'`, () => {
    req.session = {
      appeal: {
        state: 'Appeal Complete',
      },
    };

    handleAppealAlreadyReviewed(req, res, next);

    expect(res.redirect).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledWith(`/${views.appealAlreadyReviewed}`);
  });

  it('should call next if req.session.appeal.state is `Appeal Received`', () => {
    req.session = {
      appeal: {
        state: 'Appeal Received',
      },
    };

    handleAppealAlreadyReviewed(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });

  it('should call next if req.session.appeal.state is not set', () => {
    req.session.appeal = {};

    handleAppealAlreadyReviewed(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith();
  });
});
