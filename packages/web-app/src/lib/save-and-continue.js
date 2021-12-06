const logger = require('./logger');

const saveAndContinue = ({ req, res, currentPage, nextPage, viewData, saveData }) => {
  const {
    body: { errors = {}, errorSummary = [] },
    session: { appeal, casework, questionnaire } = {},
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(currentPage, {
      ...viewData,
      errors,
      errorSummary,
    });
  }

  try {
    if (casework) {
      saveData({
        appealId: appeal.appealId,
        ...casework,
      });
      res.cookie('appealId', appeal.appealId);
      res.cookie(appeal.appealId, JSON.stringify(casework));
      res.cookie('appeal_questionnaire', JSON.stringify(questionnaire));
    } else {
      saveData();
    }
  } catch (err) {
    logger.error(err);
    return res.render(currentPage, {
      ...viewData,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${nextPage}`);
};

module.exports = saveAndContinue;
