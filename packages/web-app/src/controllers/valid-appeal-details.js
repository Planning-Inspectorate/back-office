const {
  reviewAppealSubmission: previousPage,
  validAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (appealId, horizonId, valid) => ({
  pageTitle: 'Valid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  valid,
  appealReference: horizonId,
});

const getValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
      casework: { outcomeDetails },
    },
  } = req;

  res.render(currentPage, viewData(id, horizonId, outcomeDetails?.valid));
};

const postValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
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
    viewData: viewData(id, horizonId, casework.outcomeDetails.valid),
  });
};

module.exports = {
  getValidAppealDetails,
  postValidAppealDetails,
};
