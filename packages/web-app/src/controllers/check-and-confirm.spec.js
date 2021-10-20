const { getCheckAndConfirm, postCheckAndConfirm } = require('./check-and-confirm');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const {
  getText,
  reviewOutcomeOption,
  getCheckAndConfirmConfig,
} = require('../config/review-appeal-submission');

jest.mock('../lib/save-and-continue');

describe('controllers/check-and-confirm', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getCheckAndConfirm', () => {
    it('should render the view with correct data if reviewOutcome is valid', () => {
      req = {
        session: {
          appeal: { id: appealId, horizonId },
          casework: { reviewOutcome: reviewOutcomeOption.valid },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.validAppealDetails}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getCheckAndConfirmConfig(reviewOutcomeOption.valid),
        getText,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is invalid', () => {
      req = {
        session: {
          appeal: { id: appealId, horizonId },
          casework: { reviewOutcome: reviewOutcomeOption.invalid },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.invalidAppealDetails}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getCheckAndConfirmConfig(reviewOutcomeOption.invalid),
        getText,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is incomplete', () => {
      req = {
        session: {
          appeal: { id: appealId, horizonId },
          casework: { reviewOutcome: reviewOutcomeOption.incomplete },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.missingOrWrong}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: req.session.casework,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getCheckAndConfirmConfig(reviewOutcomeOption.incomplete),
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
          appeal: { id: appealId, horizonId },
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
        checkAndConfirmConfig: getCheckAndConfirmConfig(reviewOutcomeOption.incomplete),
        getText,
      };

      postCheckAndConfirm(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.checkAndConfirm,
        nextPage: views.home,
        viewData: expectedViewData,
      });
      expect(req.session.casework.completed).toEqual('true');
    });
  });
});
