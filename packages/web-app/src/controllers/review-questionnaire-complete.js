const { reviewQuestionnaireComplete: currentPage, questionnairesList } = require('../config/views');

const viewData = () => ({
  pageTitle: 'Review complete',
  hidePageTitle: 'true',
  questionnairesListLink: questionnairesList,
});

const getReviewQuestionnaireComplete = (req, res) => {
  const {
    appeal,
    questionnaire: { outcome },
  } = req.session;

  const options = { ...viewData(), appealData: appeal, outcome: outcome.toLowerCase() };

  res.render(currentPage, options);
};

module.exports = { getReviewQuestionnaireComplete };