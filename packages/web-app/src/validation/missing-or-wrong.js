const { body } = require('express-validator');
const { validateCheckboxValueAgainstOptions } = require('@pins/common/src/validation');

const validReasonOptions = [
  'namesNotMatch',
  'sensitiveInformationIncluded',
  'missingOrWrongDocuments',
  'inflammatoryComments',
  'openedInError',
  'wrongAppealType',
  'other',
];

const validDocumentOptions = [
  'noApplicationForm',
  'noDecisionNotice',
  'noGroundsOfAppeal',
  'noSupportingDocuments',
];

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
      if (reasons?.includes('missingOrWrongDocuments') && !value) {
        throw new Error('Select which documents are missing or wrong');
      }
      return true;
    }),
  body('other-reason').custom((value, { req }) => {
    const reasons = req.body['missing-or-wrong-reasons'];
    /* istanbul ignore else  */
    if (reasons && reasons.includes('other')) {
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
