const express = require('express');
const {
  getValidAppealDetails,
  postValidAppealDetails,
} = require('../controllers/valid-appeal-details');
const { validAppealDetails } = require('../config/views');
const validAppealDetailsValidation = require('../validation/valid-appeal-details');
const expressValidationErrorsToGovUkErrorList = require('../lib/express-validation-errors-to-govuk-error-list');

const router = express.Router();

router.get(`/${validAppealDetails}`, getValidAppealDetails);
router.post(
  `/${validAppealDetails}`,
  validAppealDetailsValidation(),
  expressValidationErrorsToGovUkErrorList,
  postValidAppealDetails
);

module.exports = router;
