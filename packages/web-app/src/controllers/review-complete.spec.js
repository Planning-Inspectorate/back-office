const { getReviewComplete } = require('./review-complete');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

const {
  getText,
  reviewOutcomeOption,
  getReviewOutcomeConfig,
} = require('../config/review-appeal-submission');

describe('controllers/review-complete', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getReviewComplete', () => {
    it('should render the view with correct data if reviewOutcome is valid', () => {
      req = {
        session: {
          appeal: { id: appealId },
          casework: { reviewComplete: reviewOutcomeOption.valid },
        },
      };

      const expectedViewData = {
        pageTitle: 'Review complete',
        hidePageTitle: 'true',
        reviewComplete: req.session.casework,
        appealData: req.session.appeal,
        getText,
      };

      getReviewComplete(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewComplete, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is invalid', () => {
      req = {
        session: {
          appeal: { id: appealId },
          casework: { reviewOutcome: reviewOutcomeOption.invalid },
        },
      };

      const expectedViewData = {
        pageTitle: 'Review complete',
        hidePageTitle: 'true',
        reviewComplete: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.invalid),
        getText,
      };

      getReviewComplete(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewComplete, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is incomplete', () => {
      req = {
        session: {
          appeal: { id: appealId },
          casework: { reviewOutcome: reviewOutcomeOption.incomplete },
        },
      };

      const expectedViewData = {
        pageTitle: 'Review complete',
        hidePageTitle: 'true',
        reviewComplete: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.incomplete),
        getText,
      };

      getReviewComplete(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewComplete, expectedViewData);
    });
  });
});
