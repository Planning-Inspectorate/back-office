const { questionnaireAlreadyReviewed, appealsList } = require('../config/views');

const getQuestionnaireAlreadySubmitted = (req, res) => {
  const {
    session: {
      casework: { caseOfficer: { name: caseOfficerName } = {} },
    },
  } = req;

  if (true) {
    return res.render(questionnaireAlreadyReviewed, {
      pageTitle: 'Questionnaire already reviewed',
      caseOfficerName: caseOfficerName || 'Test Officer',
    });
  }
  return res.redirect(`/${appealsList}`);
};

module.exports = {
  getQuestionnaireAlreadySubmitted,
};
