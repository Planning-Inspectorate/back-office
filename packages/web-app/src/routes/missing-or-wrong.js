const express = require('express');
const { getMissingOrWrong, postMissingOrWrong } = require('../controllers/missing-or-wrong');
const { missingOrWrong } = require('../config/views');
const { missingOrWrongAppealDetailsValidation } = require('../validation/missing-or-wrong');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get(`/${missingOrWrong}`, getMissingOrWrong);
router.post(
  `/${missingOrWrong}`,
  missingOrWrongAppealDetailsValidation(),
  expressValidationErrorsToGovUkErrorList,
  postMissingOrWrong
);

module.exports = router;
