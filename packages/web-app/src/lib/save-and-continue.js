const { saveData } = require('./api-wrapper');
const logger = require('./logger');

const saveAndContinue = ({ req, res, currentPage, nextPage, viewData }) => {
  const {
    body: { errors = {}, errorSummary = [] },
    session: { appeal, casework },
  } = req;

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      ...viewData,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    saveData(appeal.id, casework);
    res.cookie('appealId', appeal.id);
    res.cookie(appeal.id, JSON.stringify(casework));
  } catch (err) {
    logger.error(err);
    res.render(currentPage, {
      ...viewData,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${nextPage}`);
};

module.exports = saveAndContinue;
