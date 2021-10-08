const express = require('express');
const { getCheckAndConfirm, postCheckAndConfirm } = require('../controllers/check-and-confirm');
const { checkAndConfirmValidation } = require('../validation/check-and-confirm');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');
const getCaseData = require('../lib/get-case-data');

const router = express.Router();

router.get(``, getCaseData, getCheckAndConfirm);
router.post(
  ``,
  getCaseData,
  checkAndConfirmValidation(),
  expressValidationErrorsToGovUkErrorList,
  postCheckAndConfirm
);

module.exports = router;
