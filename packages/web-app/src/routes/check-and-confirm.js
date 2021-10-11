const express = require('express');
const { getCheckAndConfirm, postCheckAndConfirm } = require('../controllers/check-and-confirm');
const { checkAndConfirmValidation } = require('../validation/check-and-confirm');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', getCheckAndConfirm);
router.post(
  '/',
  checkAndConfirmValidation(),
  expressValidationErrorsToGovUkErrorList,
  postCheckAndConfirm
);

module.exports = router;
