const { reviewQuestionnaireComplete: currentPage, questionnairesList } = require('../config/views');

const viewData = () => ({
  pageTitle: 'Review complete',
  hidePageTitle: 'true',
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
