const {
  reviewQuestionnaireSubmission: previousPage,
  reviewQuestionnaireComplete: nextPage,
} = require('../config/views');

const getCheckAndConfirm = (req, res) => {
  const { questionnaire } = req.session;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    previousPage: `${previousPage}/${questionnaire.appealId}`,
    questionnaireData: questionnaire,
    reviewOutcome: questionnaire.outcome,
  });
};

const setCheckAndConfirm = (req, res) => {
  const { missingOrIncorrectDocuments } = req.session.questionnaire;

  if (Array.isArray(missingOrIncorrectDocuments)) {
    res.render('questionnaire-check-and-confirm', {
      pageTitle: 'Review questionnaire',
      reviewOutcome: 'Incomplete',
    });
  }
};

module.exports = {
  getCheckAndConfirm,
  setCheckAndConfirm,
};
