const express = require('express');
const {
  getReviewQuestionnaireSubmission,
  postReviewQuestionnaireSubmission,
} = require('../controllers/review-questionnaire-submission');

const {
  rules: reviewQuestionnaireValidationRules,
} = require('../validation/review-questionnaire-submission');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router({ mergeParams: true });

router.get('/', getReviewQuestionnaireSubmission);
router.post(
  '/',
  reviewQuestionnaireValidationRules(),
  expressValidationErrorsToGovUkErrorList,
  postReviewQuestionnaireSubmission
);

module.exports = router;
