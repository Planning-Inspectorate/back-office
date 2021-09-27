const { body } = require('express-validator');

const invalidAppealDetails = () =>
  body('invalid-appeal-reasons')
    .notEmpty()
    .withMessage('Select why the appeal is invalid')
    .bail()
    .custom((value, { req }) => {
      if (value.includes('other')) {
        const otherByText = req.body['other-by-text'];
        if (!otherByText || otherByText.trim().length === 0) {
          throw new Error('Enter why the appeal is invalid');
        }
      }
      return true;
    });

module.exports = invalidAppealDetails;
