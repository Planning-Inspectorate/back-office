const express = require('express');
const {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
} = require('../controllers/invalid-appeal-details');
const { invalidAppealDetailsValidation } = require('../validation/invalid-appeal-details');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', getInvalidAppealDetails);
router.post(
  '/',
  invalidAppealDetailsValidation(),
  expressValidationErrorsToGovUkErrorList,
  postInvalidAppealDetails
);

module.exports = router;
