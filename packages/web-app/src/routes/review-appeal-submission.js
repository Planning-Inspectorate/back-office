const express = require('express');
const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('../controllers/review-appeal-submission');
const views = require('../config/views');
const reviewOutcomeValidation = require('../validation/review-outcome');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');
const getCaseData = require('../lib/get-case-data');

const router = express.Router();

router.get(`/${views.reviewAppealSubmission}/:appealId`, getCaseData, getReviewAppealSubmission);
router.post(
  `/${views.reviewAppealSubmission}/:appealId`,
  getCaseData,
  reviewOutcomeValidation(),
  expressValidationErrorsToGovUkErrorList,
  postReviewAppealSubmission
);

module.exports = router;
