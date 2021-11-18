const { body } = require('express-validator');
const toArray = require('../lib/to-array');
const validateCheckboxValueAgainstOptions = require('./utils/validate-checkbox-against-options');

const validReasonOptions = ['1', '2', '3', '4', '5'];

const invalidAppealDetailsValidation = () => [
  body('invalid-appeal-reasons')
    .notEmpty()
    .withMessage('Select why the appeal is invalid')
    .bail()
    .custom((value) => validateCheckboxValueAgainstOptions(value, validReasonOptions)),
  body('other-reason').custom((value, { req }) => {
    const valueAsArray = toArray(req.body['invalid-appeal-reasons']);
    /* istanbul ignore else  */
    if (valueAsArray.includes('5')) {
      if (!value || value.trim().length === 0) {
        throw new Error('Enter why the appeal is invalid');
      }
    }
    return true;
  }),
];

module.exports = {
  validReasonOptions,
  invalidAppealDetailsValidation,
};
