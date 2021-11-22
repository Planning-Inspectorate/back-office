const { appealsList, appealDetails: currentPage } = require('../config/views');
const { reviewOutComeById } = require('../config/review-appeal-submission');

const viewData = (appeal, questionnaire) => ({
  pageTitle: 'Appeal details',
  backLink: `/${appealsList}`,
  appealData: {
    ...appeal,
    validationOutcomeKey: reviewOutComeById[appeal.validationOutcomeId],
  },
  questionnaireData: questionnaire,
});

const getAppealDetails = (req, res) => {
  const {
    session: { appeal, questionnaire },
  } = req;

  const options = viewData(appeal, questionnaire);
  res.render(currentPage, options);
};

module.exports = {
  getAppealDetails,
};
