const {
  reviewQuestionnaireComplete: currentPage,
  home: dashboard,
  questionnairesList,
} = require('../config/views');

const viewData = () => ({
  pageTitle: 'Review complete',
  hidePageTitle: 'true',
  dashboardLink: dashboard,
  questionnairesListLink: questionnairesList,
});

const getReviewQuestionnaireComplete = (req, res) => {
  const {
    session: { appeal, questionnaire },
  } = req;

  const options = { ...viewData(), appealData: appeal, questionnaireData: questionnaire };

  res.render(currentPage, options);
};

module.exports = { getReviewQuestionnaireComplete };
