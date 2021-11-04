const getCheckAndConfirm = (req, res) => {
  const { questionnaire } = req.session;

  res.render('questionnaire-check-and-confirm', {
    pageTitle: 'Review questionnaire',
    questionnaireData: questionnaire,
    reviewOutcome: 'Incomplete',
  });
};

const postCheckAndConfirm = (req, res) => {
  res.redirect(`/${nextPage}`);
};

module.exports = {
  getCheckAndConfirm,
};
