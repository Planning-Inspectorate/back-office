const { validationResult } = require('express-validator');

const expressValidationErrorsToGovUkErrorList = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.body.errors = errors.mapped();
    req.body.errorSummary = errors.errors.map(({ msg, param }) => ({
      text: msg,
      href: `#${param}`,
    }));
  }

  next();
};

module.exports = expressValidationErrorsToGovUkErrorList;
