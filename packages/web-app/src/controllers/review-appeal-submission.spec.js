const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('./review-appeal-submission');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/save-and-continue');

describe('controllers/review-appeal-submission', () => {
  let req;
  let res;

  const expectedViewData = {
    pageTitle: 'Review appeal submission',
    backLink: `/${views.appealsList}`,
    reviewOutcome: 'valid',
  };

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getReviewAppealSubmission', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appeal: {
              horizonId: 'abc123',
            },
            casework: {
              reviewOutcome: 'valid',
            },
          },
        },
      };

      getReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        ...expectedViewData,
        appealData: {
          horizonId: 'abc123',
        },
      });
    });

    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appeal: {
              horizonId: 'abc123',
            },
            casework: {
              reviewOutcome: 'valid',
            },
          },
        },
      };

      getReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        ...expectedViewData,
        appealData: {
          horizonId: 'abc123',
        },
      });
    });
  });

  describe('postReviewAppealSubmission', () => {
    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals `valid`', () => {
      req = {
        body: {
          'review-outcome': 'valid',
        },
        session: {
          appeal: {
            casework: {},
          },
        },
      };

      postReviewAppealSubmission(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.reviewAppealSubmission,
        nextPage: views.validAppealDetails,
        viewData: expectedViewData,
      });
      expect(req.session.appeal.casework.reviewOutcome).toEqual('valid');
    });

    it('should call saveAndContinue with the correct nextPage value when reviewOutcome does not equal `valid`', () => {
      req = {
        body: {
          'review-outcome': 'invalid',
        },
        session: {
          appeal: {
            casework: {},
          },
        },
      };

      postReviewAppealSubmission(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.reviewAppealSubmission,
        nextPage: views.home,
        viewData: {
          pageTitle: 'Review appeal submission',
          backLink: `/${views.appealsList}`,
          reviewOutcome: 'invalid',
        },
      });
      expect(req.session.appeal.casework.reviewOutcome).toEqual('invalid');
    });
  });
});
