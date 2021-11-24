const { getCheckAndConfirm, postCheckAndConfirm } = require('./check-and-confirm');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const {
  labels,
  reviewOutcomeOption,
  getReviewOutcomeConfig,
} = require('../config/review-appeal-submission');
const { sendStartEmailToLPA } = require('../lib/notify');
const { hasAppeal } = require('../config/db-fields');
const { saveAppealData } = require('../lib/api-wrapper');

jest.mock('../lib/save-and-continue');
jest.mock('../lib/notify');

describe('controllers/check-and-confirm', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const validAppealDetails = 'This appeal is valid';
  const invalidAppealReasons = ['1', '5'];
  const otherReason = 'Another invalid reason';
  const missingReasons = ['other', 'outOfTime'];
  const missingDocumentReasons = ['noApplicationForm'];

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
          appeal: { appealId },
          casework: {
            [hasAppeal.reviewOutcome]: reviewOutcomeOption.valid,
            [hasAppeal.validAppealDetails]: validAppealDetails,
          },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.validAppealDetails}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: reviewOutcomeOption.valid,
        validAppealDetails,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.valid),
        labels,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is invalid', () => {
      req = {
        session: {
          appeal: { appealId },
          casework: {
            [hasAppeal.reviewOutcome]: reviewOutcomeOption.invalid,
            [hasAppeal.invalidAppealReasons]: JSON.stringify(invalidAppealReasons),
            [hasAppeal.invalidReasonOther]: otherReason,
          },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.invalidAppealDetails}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: reviewOutcomeOption.invalid,
        invalidAppealDetails: { reasons: invalidAppealReasons, otherReason },
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.invalid),
        labels,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });

    it('should render the view with correct data if reviewOutcome is incomplete', () => {
      req = {
        session: {
          appeal: { appealId },
          casework: {
            [hasAppeal.reviewOutcome]: reviewOutcomeOption.incomplete,
            [hasAppeal.missingOrWrongReasons]: JSON.stringify(missingReasons),
            [hasAppeal.missingOrWrongDocuments]: JSON.stringify(missingDocumentReasons),
            [hasAppeal.missingOrWrongOtherReason]: otherReason,
          },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.missingOrWrong}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: reviewOutcomeOption.incomplete,
        missingOrWrongDetails: {
          reasons: missingReasons,
          documentReasons: missingDocumentReasons,
          otherReason,
        },
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.incomplete),
        labels,
      };

      getCheckAndConfirm(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.checkAndConfirm, expectedViewData);
    });
  });

  describe('postCheckAndConfirm', () => {
    it('should call saveAndContinue with the correct params if reviewOutcome is incomplete', async () => {
      req = {
        body: {
          'check-and-confirm-completed': 'true',
        },
        session: {
          appeal: { appealId },
          casework: {
            [hasAppeal.reviewOutcome]: reviewOutcomeOption.incomplete,
          },
        },
      };

      const expectedViewData = {
        pageTitle: 'Check and confirm',
        backLink: `/${views.missingOrWrong}`,
        changeOutcomeLink: `/${views.reviewAppealSubmission}/${appealId}`,
        reviewOutcome: reviewOutcomeOption.incomplete,
        appealData: req.session.appeal,
        checkAndConfirmConfig: getReviewOutcomeConfig(reviewOutcomeOption.incomplete),
        labels,
      };

      await postCheckAndConfirm(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.checkAndConfirm,
        nextPage: views.reviewComplete,
        viewData: expectedViewData,
        saveData: saveAppealData,
      });
      expect(req.session.casework.completed).toEqual('true');
    });

    it('should send sendStartEmailToLPA if only reviewOutcome is valid', async () => {
      req = {
        body: {
          'check-and-confirm-completed': 'true',
        },
        session: {
          appeal: { appealId },
          casework: {
            [hasAppeal.reviewOutcome]: reviewOutcomeOption.invalid,
          },
        },
      };

      await postCheckAndConfirm(req, res);
      expect(sendStartEmailToLPA).not.toBeCalled();

      req.session.casework[hasAppeal.reviewOutcome] = reviewOutcomeOption.incomplete;
      postCheckAndConfirm(req, res);
      expect(sendStartEmailToLPA).not.toBeCalled();

      req.session.casework[hasAppeal.reviewOutcome] = reviewOutcomeOption.valid;
      postCheckAndConfirm(req, res);
      expect(sendStartEmailToLPA).toBeCalledTimes(1);
    });

    it('should throw an error if the review outcome is not set', () => {
      expect(() => postCheckAndConfirm(req, res)).rejects.toThrow('No review outcome set');
    });
  });
});
