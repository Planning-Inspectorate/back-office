const { questionnaireAlreadyReviewed } = require('../config/views');

const getQuestionnaireAlreadySubmitted = (req, res) =>
  res.render(questionnaireAlreadyReviewed, {
    pageTitle: 'Questionnaire already reviewed',
    caseOfficerName: 'Sally Smith',
  });

module.exports = {
  getQuestionnaireAlreadySubmitted,
};
