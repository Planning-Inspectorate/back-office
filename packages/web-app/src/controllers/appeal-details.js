const { appealDetails: currentPage } = require('../config/views');

const viewData = (appeal, questionnaire) => ({
  pageTitle: 'Appeal details',
  appealData: {
    ...appeal,
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
