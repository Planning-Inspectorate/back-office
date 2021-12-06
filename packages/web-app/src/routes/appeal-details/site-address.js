const express = require('express');
const siteAddressController = require('../../controllers/appeal-details/site-address');
const {
  rules: siteLocationValidationRules,
} = require('../../validation/appeal-details/site-location');
const expressValidationErrorsToGovUkErrorList = require('../../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', siteAddressController.getSiteAddress);
router.post(
  '/',
  [siteLocationValidationRules(), expressValidationErrorsToGovUkErrorList],
  siteAddressController.postSiteAddress
);

module.exports = router;
