const { getCheckAndConfirm, postCheckAndConfirm } = require('./check-and-confirm');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const {
  getText,
  reviewOutcomeOption,
  getReviewOutcomeConfig,
} = require('../config/review-appeal-submission');
const { sendStartEmailToLPA } = require('../lib/notify');

jest.mock('../lib/save-and-continue');
jest.mock('../lib/notify');

describe('controllers/check-and-confirm', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getCheckAndConfirm', () => {
    it('should render the view with correct data if reviewOutcome is valid', () => {
      req = {
        session: {
          appeal: { appealId, horizonId },
          casework: { reviewOutcome: reviewOutcomeOption.valid },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.validAppealDetails}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.valid),
        getText,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is invalid', () => {
      req = {
        session: {
          appeal: { appealId, horizonId },
          casework: { reviewOutcome: reviewOutcomeOption.invalid },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.invalidAppealDetails}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.invalid),
        getText,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is incomplete', () => {
      req = {
        session: {
          appeal: { appealId, horizonId },
          casework: { reviewOutcome: reviewOutcomeOption.incomplete },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.missingOrWrong}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.incomplete),
        getText,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });
  });

  describe('postCheckAndConfirm', () => {
    it('should call saveAndContinue with the correct params if reviewOutcome is incomplete', () => {
      req = {
        body: {
          'check-and-confirm-completed': 'true',
        },
        session: {
          appeal: { appealId, horizonId },
          casework: {
            reviewOutcome: reviewOutcomeOption.incomplete,
          },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.missingOrWrong}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.incomplete),
        getText,
      };

      postCheckAndConfirm(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.checkAndConfirm,
        nextPage: views.reviewComplete,
        viewData: expectedViewData,
      });
      expect(req.session.casework.completed).toEqual('true');
    });

    it('should send sendStartEmailToLPA if only reviewOutcome is valid', () => {
      req = {
        body: {
          'check-and-confirm-completed': 'true',
        },
        session: {
          appeal: { appealId, horizonId },
          casework: {
            reviewOutcome: reviewOutcomeOption.invalid,
          },
        },
      };

      postCheckAndConfirm(req, res);
      expect(sendStartEmailToLPA).not.toBeCalled();

      req.session.casework.reviewOutcome = reviewOutcomeOption.incomplete;
      postCheckAndConfirm(req, res);
      expect(sendStartEmailToLPA).not.toBeCalled();

      req.session.casework.reviewOutcome = reviewOutcomeOption.valid;
      postCheckAndConfirm(req, res);
      expect(sendStartEmailToLPA).toBeCalledTimes(1);
    });
  });
});
