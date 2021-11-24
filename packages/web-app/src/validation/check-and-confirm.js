const { body } = require('express-validator');
const { reviewOutcomeOption } = require('../config/review-appeal-submission');
const { hasAppeal } = require('../config/db-fields');

const checkAndConfirmValidation = () =>
  body('check-and-confirm-completed').custom((value, { req }) => {
    const { casework = {} } = req.session;
    if (casework[hasAppeal.reviewOutcome] === reviewOutcomeOption.incomplete && value !== 'true') {
      throw new Error('Confirm if you have completed all follow-up tasks and emails');
    }
    return true;
  });

module.exports = {
  checkAndConfirmValidation,
};
