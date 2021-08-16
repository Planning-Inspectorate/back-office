const express = require('express');
const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('../controllers/review-appeal-submission');
const views = require('../config/views');
const reviewOutcomeValidation = require('../validation/review-outcome');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get(`/${views.reviewAppealSubmission}`, getReviewAppealSubmission);
router.post(
  `/${views.reviewAppealSubmission}`,
  reviewOutcomeValidation(),
  expressValidationErrorsToGovUkErrorList,
  postReviewAppealSubmission
);

module.exports = router;
