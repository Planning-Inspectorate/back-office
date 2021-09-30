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
            horizonId: 'abc123',
          },
          casework: {
            reviewOutcome: 'valid',
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
            horizonId: 'abc123',
          },
          casework: {
            reviewOutcome: 'valid',
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
          casework: {},
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
      expect(req.session.casework.reviewOutcome).toEqual('valid');
    });

    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals `invalid`', () => {
      req = {
        body: {
          'review-outcome': 'invalid',
        },
        session: {
          appeal: {
            id: '1234',
          },
          casework: {},
        },
      };

      postReviewAppealSubmission(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.reviewAppealSubmission,
        nextPage: views.invalidAppealDetails,
        viewData: {
          pageTitle: 'Review appeal submission',
          backLink: `/${views.appealsList}`,
          reviewOutcome: 'invalid',
        },
      });
      expect(req.session.casework.reviewOutcome).toEqual('invalid');
    });

    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals `incomplete`', () => {
      req = {
        body: {
          'review-outcome': 'incomplete',
        },
        session: {
          appeal: {
            id: '1234',
          },
          casework: {},
        },
      };

      postReviewAppealSubmission(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.reviewAppealSubmission,
        nextPage: `${views.missingOrWrong}`,
        viewData: {
          pageTitle: 'Review appeal submission',
          backLink: `/${views.appealsList}`,
          reviewOutcome: req.body['review-outcome'],
        },
      });
      expect(req.session.casework.reviewOutcome).toEqual(req.body['review-outcome']);
    });

    it('should call saveAndContinue with the home page value when reviewOutcome is not one of valid options', () => {
      req = {
        body: {
          'review-outcome': 'someInvalidOption',
        },
        session: {
          appeal: {
            id: '1234',
          },
          casework: {},
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
          reviewOutcome: req.body['review-outcome'],
        },
      });
      expect(req.session.casework.reviewOutcome).toEqual(req.body['review-outcome']);
    });

    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals `incomplete`', () => {
      req = {
        body: {
          'review-outcome': 'incomplete',
        },
        session: {
          appeal: {
            appeal: {
              id: '1234',
            },
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
        nextPage: `${views.missingOrWrong}`,
        viewData: {
          pageTitle: 'Review appeal submission',
          backLink: `/${views.appealsList}`,
          reviewOutcome: req.body['review-outcome'],
        },
      });
      expect(req.session.appeal.casework.reviewOutcome).toEqual(req.body['review-outcome']);
    });

    it('should call saveAndContinue with the home page value when reviewOutcome is not one of valid options', () => {
      req = {
        body: {
          'review-outcome': 'someInvalidOption',
        },
        session: {
          appeal: {
            appeal: {
              id: '1234',
            },
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
          reviewOutcome: req.body['review-outcome'],
        },
      });
      expect(req.session.appeal.casework.reviewOutcome).toEqual(req.body['review-outcome']);
    });
  });
});
