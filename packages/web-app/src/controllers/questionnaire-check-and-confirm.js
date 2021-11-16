const { reviewQuestionnaireSubmission: previousPage } = require('../config/views');

const { saveAppealData } = require('../lib/api-wrapper');

const getCheckAndConfirm = (req, res) => {
  const { questionnaire, appeal } = req.session;
  const { outcome } = questionnaire;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    previousPage: `/${previousPage}/${appeal.appealId}`,
    questionnaireData: questionnaire,
    reviewOutcome: outcome,
  });
};

const setCheckAndConfirm = async (req, res) => {
  const { outcome } = req.session.questionnaire;
  const { appealId } = req.params;

  if (outcome === 'Complete') {
    await saveAppealData({ appealId, lpaQuestionnaireReviewOutcomeId: 1 });
    return res.render('review-questionnaire-complete', {
      pageTitle: 'Review questionnaire',
      appealData: req.session.appeal,
      questionnaireData: req.session.questionnaire,
    });
  }

  await saveAppealData({ appealId, lpaQuestionnaireReviewOutcomeId: 2 });
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
