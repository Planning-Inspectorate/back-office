const getCheckAndConfirm = (req, res) => {
  const { questionnaire } = req.session;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    questionnaireData: questionnaire,
    reviewOutcome: 'Incomplete',
  });
};

module.exports = {
  getCheckAndConfirm,
};
