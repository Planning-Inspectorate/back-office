const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('./review-appeal-submission');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { hasAppeal } = require('../config/db-fields');
const { saveAppealData } = require('../lib/api-wrapper');

jest.mock('../lib/save-and-continue');

describe('controllers/review-appeal-submission', () => {
  let req;
  let res;

  const expectedViewData = {
    pageTitle: 'Review appeal submission',
    backLink: `/${views.appealsList}`,
    reviewOutcome: '1',
  };
  const appealId = 'ff5fe7af-e69c-4c0e-9d78-70890b2a6e31';

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getReviewAppealSubmission', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appealId,
          },
          casework: {
            [hasAppeal.reviewOutcome]: '1',
          },
        },
      };

      getReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        ...expectedViewData,
        appealData: {
          appealId,
        },
      });
    });

    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appealId,
          },
          casework: {
            [hasAppeal.reviewOutcome]: '1',
          },
        },
      };

      getReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        ...expectedViewData,
        appealData: {
          appealId,
        },
      });
    });
  });

  describe('postReviewAppealSubmission', () => {
    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals 1', () => {
      req = {
        body: {
          'review-outcome': '1',
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
        saveData: saveAppealData,
      });
      expect(req.session.casework[hasAppeal.reviewOutcome]).toEqual('1');
    });

    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals 2', () => {
      req = {
        body: {
          'review-outcome': '2',
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
          reviewOutcome: '2',
        },
        saveData: saveAppealData,
      });
      expect(req.session.casework[hasAppeal.reviewOutcome]).toEqual('2');
    });

    it('should call saveAndContinue with the correct nextPage value when reviewOutcome equals 3', () => {
      req = {
        body: {
          'review-outcome': '3',
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
        saveData: saveAppealData,
      });
      expect(req.session.casework[hasAppeal.reviewOutcome]).toEqual('3');
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
        saveData: saveAppealData,
      });
      expect(req.session.casework[hasAppeal.reviewOutcome]).toEqual(req.body['review-outcome']);
    });
  });
});
