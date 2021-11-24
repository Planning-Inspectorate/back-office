const { body } = require('express-validator');
const validateCheckboxValueAgainstOptions = require('./utils/validate-checkbox-against-options');

const validReasonOptions = ['1', '2', '3', '4', '5', '6', '7'];
const validDocumentOptions = ['1', '2', '3', '4'];

const missingOrWrongAppealDetailsValidation = () => [
  body('missing-or-wrong-reasons')
    .notEmpty()
    .withMessage('Select what is missing or wrong in the appeal submission')
    .bail()
    .custom((value) => validateCheckboxValueAgainstOptions(value, validReasonOptions)),
  body('missing-or-wrong-documents')
    .custom((value) => validateCheckboxValueAgainstOptions(value, validDocumentOptions))
    .bail()
    .custom((value, { req }) => {
      const reasons = req.body['missing-or-wrong-reasons'];
      /* istanbul ignore else  */
      if (reasons?.includes('3') && !value) {
        throw new Error('Select which documents are missing or wrong');
      }
      return true;
    }),
  body('other-reason').custom((value, { req }) => {
    const reasons = req.body['missing-or-wrong-reasons'];
    /* istanbul ignore else  */
    if (reasons && reasons.includes('7')) {
      if (!value || value.trim().length === 0) {
        throw new Error('Enter what is missing or wrong in the appeal submission');
      }
    }
    return true;
  }),
];

module.exports = {
  validReasonOptions,
  missingOrWrongAppealDetailsValidation,
};
