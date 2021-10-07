const express = require('express');
const { getMissingOrWrong, postMissingOrWrong } = require('../controllers/missing-or-wrong');
const { missingOrWrongAppealDetailsValidation } = require('../validation/missing-or-wrong');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get('/', getMissingOrWrong);
router.post(
  '/',
  missingOrWrongAppealDetailsValidation(),
  expressValidationErrorsToGovUkErrorList,
  postMissingOrWrong
);

module.exports = router;
