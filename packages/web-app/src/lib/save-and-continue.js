const logger = require('./logger');

const saveAndContinue = ({ req, res, currentPage, nextPage, viewData, saveData }) => {
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
    if (typeof saveData !== 'function') {
      throw new Error('The saveData parameter must be a save data function');
    }

    saveData({
      appealId: appeal.appealId,
      ...casework,
      ...questionnaire,
    });
    res.cookie('appealId', appeal.appealId);
    res.cookie(appeal.appealId, JSON.stringify(casework));
    res.cookie('appeal_questionnaire', JSON.stringify(questionnaire));
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