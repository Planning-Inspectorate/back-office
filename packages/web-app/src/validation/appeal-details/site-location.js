const { body } = require('express-validator');

function validatePostcode(postcode) {
  const pattern =
    /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
  const result = pattern.exec(postcode);
  if (!result) {
    throw new Error('Enter a real postcode');
  }
  return postcode;
}

const ruleAddressLine1 = () =>
  body('site-address-line-one')
    .escape()
    .notEmpty()
    .withMessage('Enter the first line of the address')
    .bail()
    .isLength({ min: 1, max: 60 })
    .bail()
    .withMessage('The first line of the address must be 60 characters or fewer');

const ruleAddressLine2 = () =>
  body('site-address-line-two')
    .escape()
    .isLength({ min: 0, max: 60 })
    .bail()
    .withMessage('The second line of the address must be 60 characters or fewer');

const ruleAddressTownCity = () =>
  body('site-town-city')
    .escape()
    .isLength({ min: 0, max: 60 })
    .bail()
    .withMessage('Town or City must be 60 characters or fewer');

const ruleAddressCounty = () =>
  body('site-county')
    .escape()
    .isLength({ min: 0, max: 60 })
    .bail()
    .withMessage('County must be 60 characters or fewer');

const ruleAddressPostCode = () =>
  body('site-postcode')
    .escape()
    .notEmpty()
    .withMessage('Enter a real postcode')
    .bail()
    .isLength({ min: 1, max: 8 })
    .bail()
    .withMessage('Postcode must be 8 characters or fewer')
    .bail()
    .custom((email) => validatePostcode(email));

const rules = () => [
  ruleAddressLine1(),
  ruleAddressLine2(),
  ruleAddressTownCity(),
  ruleAddressCounty(),
  ruleAddressPostCode(),
];

module.exports = {
  rules,
};
