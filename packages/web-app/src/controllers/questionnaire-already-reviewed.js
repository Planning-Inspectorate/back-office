const { questionnaireAlreadyReviewed, questionnairesList } = require('../config/views');

const getQuestionnaireAlreadySubmitted = (req, res) => {
  const {
    session: {
      casework: { caseOfficer: { name: caseOfficerName } = {} },
    },
  } = req;

  if (true) {
    return res.render(questionnaireAlreadyReviewed, {
      pageTitle: 'Questionnaire already reviewed',
      caseOfficerName: caseOfficerName || 'Sam Wilson',
    });
  }

  return res.redirect(`/${questionnairesList}`);
};

module.exports = {
  getQuestionnaireAlreadySubmitted,
};
