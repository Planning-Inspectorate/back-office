const express = require('express');
const {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
} = require('../controllers/invalid-appeal-details');
const { invalidAppealDetails } = require('../config/views');
const invalidAppealDetailsValidation = require('../validation/invalid-appeal-details');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get(`/${invalidAppealDetails}/:appealId`, getInvalidAppealDetails);
router.post(
  `/${invalidAppealDetails}/:appealId`,
  invalidAppealDetailsValidation(),
  expressValidationErrorsToGovUkErrorList,
  postInvalidAppealDetails
);

module.exports = router;
