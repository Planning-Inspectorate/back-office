const {
  reviewAppealSubmission: previousPage,
  validAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { hasAppeal } = require('../config/db-fields');

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
      casework: { [hasAppeal.validAppealDetails]: validAppealDetails },
    },
  } = req;

  res.render(currentPage, viewData(appealId, caseReference, validAppealDetails));
};

const postValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework,
    },
    body,
  } = req;

  const validAppealDetails = body['valid-appeal-details'];

  casework[hasAppeal.validAppealDetails] = validAppealDetails;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(appealId, caseReference, validAppealDetails),
  });
};

module.exports = {
  getValidAppealDetails,
  postValidAppealDetails,
};
