const express = require('express');
const {
  getReviewQuestionnaire,
  postReviewQuestionnaire,
} = require('../controllers/review-questionnaire');

const { rules: reviewQuestionnaireValidationRules } = require('../validation/review-questionnaire');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', getReviewQuestionnaire);
router.post(
  '/',
  reviewQuestionnaireValidationRules(),
  expressValidationErrorsToGovUkErrorList,
  postReviewQuestionnaire
);

module.exports = router;
