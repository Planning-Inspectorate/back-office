const {
  reviewAppealSubmission: previousPage,
  invalidAppealDetails: currentPage,
  home: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (appealId, horizonId, invalidAppealDetails) => ({
  pageTitle: 'Invalid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  invalidAppealDetails,
  appealReference: horizonId,
});

const getInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: {
        appeal: { id, horizonId },
        casework: { invalidAppealDetails },
      },
    },
  } = req;

  res.render(currentPage, viewData(id, horizonId, invalidAppealDetails));
};

const postInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: {
        appeal: { id, horizonId },
      },
    },
    body,
  } = req;

  const reasons = body['invalid-appeal-reasons'];
  const otherReason = body['other-reason'];

  const invalidAppealDetails = {
    reasons,
    otherReason,
  };

  req.session.appeal.casework.invalidAppealDetails = invalidAppealDetails;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(id, horizonId, invalidAppealDetails),
  });
};

module.exports = {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
};
