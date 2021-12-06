const govUkErrorListOnlyFirst = (req, res, next) => {
  const { errorSummary } = req.body;
  if (errorSummary && errorSummary.length > 1) {
    req.body.errorSummary = errorSummary.slice(0, 1);
  }

  next();
};

module.exports = govUkErrorListOnlyFirst;
