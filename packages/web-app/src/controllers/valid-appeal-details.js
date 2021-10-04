const {
  reviewAppealSubmission: previousPage,
  validAppealDetails: currentPage,
  home: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (appealId, horizonId, validAppealDetails) => ({
  pageTitle: 'Valid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  validAppealDetails,
  appealReference: horizonId,
});

const getValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
      casework: { validAppealDetails },
    },
  } = req;

  res.render(currentPage, viewData(id, horizonId, validAppealDetails));
};

const postValidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
    },
    body,
  } = req;

  req.session.casework.validAppealDetails = req.body['valid-appeal-details'];

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(id, horizonId, body['valid-appeal-details']),
  });
};

module.exports = {
  getValidAppealDetails,
  postValidAppealDetails,
};
