const { body } = require('express-validator');
const { reviewOutcomeOption } = require('../config/review-appeal-submission');

const checkAndConfirmValidation = () =>
  body('check-and-confirm-completed').custom((value, { req }) => {
    if (
      req.session.casework?.reviewOutcome === reviewOutcomeOption.incomplete &&
      value !== 'true'
    ) {
      throw new Error('Confirm if you have completed all follow-up tasks and emails');
    }
    return true;
  });

module.exports = {
  checkAndConfirmValidation,
};
