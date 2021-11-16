const {
  reviewQuestionnaireSubmission: previousPage,
  reviewQuestionnaireComplete: nextPage,
} = require('../config/views');

const getCheckAndConfirm = (req, res) => {
  const { appeal, questionnaire } = req.session;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    previousPage: `${previousPage}/${questionnaire.appealId}`,
    appealReference: appeal.caseReference,
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
