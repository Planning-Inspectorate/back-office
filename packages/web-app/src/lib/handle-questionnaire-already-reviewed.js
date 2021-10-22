const views = require('../config/views');

const handleQuestionnaireAlreadyReviewed = (req, res, next) => {
  const {
    session: {
      questionnaire: { state },
    },
  } = req;

  return state && state !== 'Questionnaire Received'
    ? res.redirect(`/${views.questionnaireAlreadyReviewed}`)
    : next();
};

module.exports = handleQuestionnaireAlreadyReviewed;
