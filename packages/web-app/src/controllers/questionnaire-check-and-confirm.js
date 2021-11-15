const { reviewQuestionnaireSubmission: previousPage } = require('../config/views');

const { saveData } = require('../lib/api-wrapper');

const getCheckAndConfirm = (req, res) => {
  const { questionnaire } = req.session;
  let { missingOrIncorrectDocuments } = questionnaire;

  missingOrIncorrectDocuments = missingOrIncorrectDocuments || [];

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    previousPage: `${previousPage}/${questionnaire.appealId}`,
    questionnaireData: questionnaire,
    reviewOutcome: missingOrIncorrectDocuments.length > 1 ? 'Incomplete' : 'Complete',
  });
};

const setCheckAndConfirm = async (req, res) => {
  const { missingOrIncorrectDocuments } = req.session.questionnaire;
  const { appealId } = req.params;

  if (Array.isArray(missingOrIncorrectDocuments)) {
    if (missingOrIncorrectDocuments.length > 1) {
      await saveData({ appealId, lpaQuestionnaireReviewOutcomeId: 2 });
    }

    await saveData({ appealId, lpaQuestionnaireReviewOutcomeId: 1 });
    return res.render('review-questionnaire', {
      pageTitle: 'Review questionnaire',
      appealData: req.session.appeal,
      questionnaireData: req.session.questionnaire,
    });
  }

  return res.render('review-questionnaire-complete', {
    pageTitle: 'Review questionnaire',
    appealData: req.session.appeal,
    questionnaireData: req.session.questionnaire,
  });
};

module.exports = {
  getCheckAndConfirm,
  setCheckAndConfirm,
};
