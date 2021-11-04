const { saveData } = require('./api-wrapper');
const logger = require('./logger');

const saveAndContinue = ({ req, res, currentPage, nextPage, viewData }) => {
  const {
    body: { errors = {}, errorSummary = [] },
    session: { appeal, casework, questionnaire },
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
    saveData({
      appealId: appeal.appealId,
      ...casework,
    });
    res.cookie('appealId', appeal.appealId);
    res.cookie(appeal.appealId, JSON.stringify(casework));
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
