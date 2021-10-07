const express = require('express');
const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('../controllers/review-appeal-submission');
const reviewOutcomeValidation = require('../validation/review-outcome');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', getReviewAppealSubmission);
router.post(
  '/',
  reviewOutcomeValidation(),
  expressValidationErrorsToGovUkErrorList,
  postReviewAppealSubmission
);

module.exports = router;
