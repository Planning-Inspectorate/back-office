const express = require('express');
const caseOfficerController = require('../../controllers/appeal-details/case-officer');
const { rules: caseOfficerRules } = require('../../validation/appeal-details/case-officer-details');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', caseOfficerController.getCaseOfficerDetails);
router.post(
  '/',
  [caseOfficerRules(), expressValidationErrorsToGovUkErrorList],
  caseOfficerController.postCaseOfficerDetails
);

module.exports = router;
