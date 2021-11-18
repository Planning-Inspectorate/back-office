const { appealsList, appealDetails: currentPage } = require('../config/views');
const { hasAppeal } = require('../config/db-fields');

const viewData = (reviewOutcome) => ({
  pageTitle: 'Appeal details',
  backLink: `/${appealsList}`,
  reviewOutcome,
});

const getAppealDetails = (req, res) => {
  const {
    session: {
      appeal,
      questionnaire,
      casework: { [hasAppeal.reviewOutcome]: reviewOutcome },
    },
  } = req;

  const options = {
    ...viewData(reviewOutcome),
    appealData: {
      ...appeal,
      appealValidationDate: '2021-10-21T00:00:00.000Z',
      validationOfficerFirstName: 'FirstName',
      validationOfficerSurname: 'Surname',
      validationOfficerEmail: 'email@gmail.com',
      caseOfficerFirstName: 'FirstName',
      caseOfficerSurname: 'Surname',
      caseOfficerEmail: 'email@gmail.com',
      inspectorFirstName: 'FirstName',
      inspectorSurname: 'Surname',
      inspectorEmail: 'email@gmail.com',
      decisionOutcomeName: 'Not available yet',
      validationOutcomeId: 3,
      validationOutcomeName: 'Something missing or wrong',
    },
    questionnaireData: {
      ...questionnaire,
      recommendedSiteVisitTypeName: 'Unaccompanied',
      siteVisitTypeName: 'Unaccompanied',
      scheduledSiteVisitDate: '2021-10-21T00:00:00.000Z',
    },
  };
  console.log('AAAAAA', JSON.stringify(options));
  res.render(currentPage, options);
};

module.exports = {
  getAppealDetails,
};
