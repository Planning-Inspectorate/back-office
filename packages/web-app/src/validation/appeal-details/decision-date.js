const { body } = require('express-validator');
const { isAfter, endOfDay } = require('date-fns');
const dateInputValidation = require('../custom/date-input');

const rules = () => [
  ...(dateInputValidation('decision-date', 'the Decision Date') || []),
  body('decision-date').custom((value) => {
    const today = endOfDay(new Date());

    if (isAfter(new Date(value), today)) {
      throw new Error('Decision date must be today or in the past');
    }

    return true;
  }),
];

module.exports = {
  rules,
};
