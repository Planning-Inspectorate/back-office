const { body } = require('express-validator');
const { toArray } = require('@pins/common/src/utils');

const validReasonOptions = [
  'outOfTimes',
  'noRightOfAppeal',
  'notAppealable',
  'lpaDeemedApplicationAsInvalid',
  'other',
];

const invalidAppealDetailsValidation = () => [
  body('invalid-appeal-reasons')
    .notEmpty()
    .withMessage('Select why the appeal is invalid')
    .bail()
    .custom((value) => {
      const valueAsArray = toArray(value);
      if (!valueAsArray.every((item) => validReasonOptions.includes(item))) {
        throw new Error('Invalid option(s) received');
      }
      return true;
    }),
  body('other-reason').custom((value, { req }) => {
    const valueAsArray = toArray(req.body['invalid-appeal-reasons']);
    if (valueAsArray.includes('other')) {
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
