const { reviewQuestionnaireSubmission: previousPage } = require('../config/views');

const { saveData } = require('../lib/api-wrapper');

const getCheckAndConfirm = (req, res) => {
  const { questionnaire } = req.session;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    previousPage: `${previousPage}/${questionnaire.appealId}`,
    questionnaireData: questionnaire,
    reviewOutcome: questionnaire.outcome,
  });
};

const setCheckAndConfirm = async (req, res) => {
  const { missingOrIncorrectDocuments } = req.session.questionnaire;

  if (Array.isArray(missingOrIncorrectDocuments)) {
    if (missingOrIncorrectDocuments.length > 1) {
      await saveData({ lpaQuestionnaireReviewOutcomeId: 2 });
      return res.render('review-questionnaire', {
        pageTitle: 'Review questionnaire',
      });
    }

    await saveData({ lpaQuestionnaireReviewOutcomeId: 1 });
    return res.render('review-questionnaire-complete', {
      pageTitle: 'Review questionnaire',
    });
  }

  return res.render('not-found');
};

module.exports = {
  getCheckAndConfirm,
  setCheckAndConfirm,
};
