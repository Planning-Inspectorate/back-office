const express = require('express');
const applicationDecisionDateController = require('../../controllers/appeal-details/application-decision-date');
const {
  rules: decisionDateValidationRules,
} = require('../../validation/appeal-details/decision-date');
const combineDateInputsMiddleware = require('../../middleware/combine-date-inputs');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', applicationDecisionDateController.getApplicationDecisionDate);
router.post(
  '/',
  [
    combineDateInputsMiddleware,
    decisionDateValidationRules(),
    expressValidationErrorsToGovUkErrorList,
  ],
  applicationDecisionDateController.postApplicationDecisionDate
);

module.exports = router;
