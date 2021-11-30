const express = require('express');
const applicantNameController = require('../../controllers/appeal-details/appellant');
const { rules: yourDetailsRules } = require('../../validation/appeal-details/appellant-details');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', applicantNameController.getAppellantDetails);
router.post(
  '/',
  [yourDetailsRules(), expressValidationErrorsToGovUkErrorList],
  applicantNameController.postAppellantDetails
);

module.exports = router;
