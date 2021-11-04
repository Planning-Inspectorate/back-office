const {
  reviewAppealSubmission: previousPage,
  validAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (appealId, caseReference, valid) => ({
  pageTitle: 'Valid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  valid,
  appealReference: caseReference,
});

const getValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework: { outcomeDetails },
    },
  } = req;

  res.render(currentPage, viewData(appealId, caseReference, outcomeDetails?.valid));
};

const postValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework,
    },
    body,
  } = req;

  casework.outcomeDetails = {
    valid: {
      description: body['valid-appeal-details'],
    },
  };

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(appealId, caseReference, casework.outcomeDetails.valid),
  });
};

module.exports = {
  getValidAppealDetails,
  postValidAppealDetails,
};
