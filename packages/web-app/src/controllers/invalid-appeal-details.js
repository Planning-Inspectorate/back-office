const {
  reviewAppealSubmission: previousPage,
  invalidAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { getText } = require('../lib/review-appeal-submission');

const viewData = (appealId, horizonId, invalidAppealDetails) => ({
  pageTitle: 'Invalid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  getText,
  invalidAppealDetails,
  appealReference: horizonId,
});

const getInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
      casework: { invalidAppealDetails },
    },
  } = req;
  const options = {
    ...viewData(id, horizonId, invalidAppealDetails),
    getText,
  };
  res.render(currentPage, options);
};

const postInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
    },
    body,
  } = req;

  const reasons = body['invalid-appeal-reasons'];
  const otherReason = body['other-reason'];

  const invalidAppealDetails = {
    reasons,
    otherReason,
  };

  req.session.casework.invalidAppealDetails = invalidAppealDetails;

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
