const express = require('express');
const {
  getReviewQuestionnaire,
  postReviewQuestionnaire,
} = require('../controllers/review-questionnaire');

const { rules: reviewQuestionnaireValidationRules } = require('../validation/review-questionnaire');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get(`/questionnaires-for-review/review/:id`, getReviewQuestionnaire);
router.post(
  `/questionnaires-for-review/review/:id`,
  reviewQuestionnaireValidationRules(),
  expressValidationErrorsToGovUkErrorList,
  postReviewQuestionnaire
);

module.exports = router;
