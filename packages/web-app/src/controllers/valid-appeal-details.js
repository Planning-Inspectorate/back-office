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
      appeal: { id, caseReference },
      casework: { outcomeDetails },
    },
  } = req;

  res.render(currentPage, viewData(id, caseReference, outcomeDetails?.valid));
};

const postValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, caseReference },
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
    viewData: viewData(id, caseReference, casework.outcomeDetails.valid),
  });
};

module.exports = {
  getValidAppealDetails,
  postValidAppealDetails,
};
