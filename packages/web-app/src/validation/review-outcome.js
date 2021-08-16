const { body } = require('express-validator');

const reviewOutcome = () =>
  body('review-outcome')
    .notEmpty()
    .withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong')
    .bail()
    .isIn(['valid', 'invalid', 'incomplete'])
    .withMessage('Select if the appeal is valid or invalid, or if something is missing or wrong');

module.exports = reviewOutcome;
