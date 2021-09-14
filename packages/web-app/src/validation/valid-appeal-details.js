const { body } = require('express-validator');

const validAppealDetails = () =>
  body('valid-appeal-details').notEmpty().withMessage('Enter a description of development');

module.exports = validAppealDetails;
