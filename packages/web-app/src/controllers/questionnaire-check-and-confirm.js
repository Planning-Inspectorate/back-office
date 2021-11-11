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

const postCheckAndConfirm = (req, res) => {
  res.redirect(`/${nextPage}`);
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
