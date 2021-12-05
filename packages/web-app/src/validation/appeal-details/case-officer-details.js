const { body } = require('express-validator');

const ruleCaseOfficerName = () =>
  body('case-officer-name')
    // .notEmpty()
    // .withMessage('Enter your name')
    // .bail()
    .optional({ checkFalsy: true, nullable: true })
    .matches(/^[a-z\-' ]+$/i)
    .withMessage('Name must only include letters a to z, hyphens, spaces and apostrophes')
    .bail()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters');

function validateEmail(email) {
  const pattern = /.+@[^.]*(.*)/;

  const result = pattern.exec(email);

  /* istanbul ignore else */
  if (result && result.length > 1 && result[1].length > 2) {
    return email;
  }

  /* istanbul ignore next */
  throw new Error('Enter an email address in the correct format, like name@example.com');
}

const ruleCaseOfficerEmail = () =>
  body('case-officer-email')
    // .notEmpty()
    // .withMessage('Enter your email address')
    // .bail()
    .optional({ checkFalsy: true, nullable: true })
    .isEmail()
    .withMessage('Enter an email address in the correct format, like name@example.com')
    .bail()
    .matches(/^(?=[\w\s])\s*[-+.'\w]*['\w]+@[-.\w]+\.[-.\w]+\s*$/)
    .withMessage('Enter an email address in the correct format, like name@example.com')
    .bail()
    .custom((email) => validateEmail(email));

const rules = () => [ruleCaseOfficerName(), ruleCaseOfficerEmail()];

module.exports = {
  rules,
};
