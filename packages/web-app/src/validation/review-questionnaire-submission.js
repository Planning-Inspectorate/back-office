const { body } = require('express-validator');

const popRow = (name, error) => ({
  textAreaName: `lpaqreview-${name}-textarea`,
  checkboxName: `lpaqreview-${name}-checkbox`,
  errorMessage: error,
});

const blankTextAreaValidations = () => [
  popRow('plans-decision', `Enter which plans are missing`),
  popRow('statutory-development', 'Enter which statutory development plan policies are missing'),
  popRow('other-relevant-policies', 'Enter which other relevant policies are missing'),
  popRow('supplementary-planning', 'Enter which supplementary planning documents are missing'),
  popRow('conservation-guidance', 'Enter what conservation area documentation is missing'),
  popRow('listing-description', 'Enter what is wrong with the listing description'),
  popRow('representations', 'Enter which representations are missing or incorrect'),
];

const popSubCheckboxes = (name) => ({
  checkboxName: `lpaqreview-${name}-notification-checkbox`,
  subCheckbox1Name: `lpaqreview-${name}-notification-subcheckbox1`,
  subCheckbox2Name: `lpaqreview-${name}-notification-subcheckbox2`,
  errorMessage: `Select which ${name} notification is missing or incorrect`,
});

const unselectedSubCheckboxValidations = () => [
  popSubCheckboxes('application'),
  popSubCheckboxes('appeal'),
];

const validateBlankTextArea = (value, req, checkboxName, errorMessage) => {
  if (!value || value.trim().length === 0) {
    if (req.body[checkboxName]?.includes('on')) {
      throw new Error(errorMessage);
    }
  }
};

const validateSubCheckbox = (value, req, element) => {
  if (value === undefined) {
    if (
      req.body[element.checkboxName]?.includes('on') &&
      (req.body[element.subCheckbox2Name]?.includes(undefined) ||
        req.body[element.subCheckbox2Name] === undefined)
    ) {
      throw new Error(element.errorMessage);
    }
  }
};

const rules = () =>
  [
    blankTextAreaValidations().map((element) =>
      body(element.textAreaName).custom((value, { req }) => {
        validateBlankTextArea(value, req, element.checkboxName, element.errorMessage);
        return true;
      })
    ),

    unselectedSubCheckboxValidations().map((element) =>
      body(element.subCheckbox1Name).custom((value, { req }) => {
        validateSubCheckbox(value, req, element);
        return true;
      })
    ),
  ].flat();

module.exports = {
  rules,
};
