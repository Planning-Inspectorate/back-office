const express = require('express');
const applicationDecisionDateController = require('../../controllers/appeal-details/application-decision-date');
const {
  rules: decisionDateValidationRules,
} = require('../../validation/appeal-details/decision-date');
const combineDateInputsMiddleware = require('../../middleware/combine-date-inputs');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');
const govukErrorListOnlyFirst = require('../../lib/govuk-error-list-only-first');

const router = express.Router();

router.get('/', applicationDecisionDateController.getApplicationDecisionDate);
router.post(
  '/',
  [
    combineDateInputsMiddleware,
    decisionDateValidationRules(),
    expressValidationErrorsToGovUkErrorList,
    govukErrorListOnlyFirst,
  ],
  applicationDecisionDateController.postApplicationDecisionDate
);

module.exports = router;
