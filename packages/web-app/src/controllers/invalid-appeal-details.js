const { toArray } = require('@pins/common/src/utils');
const {
  reviewAppealSubmission: previousPage,
  invalidAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { getText } = require('../config/review-appeal-submission');

const viewData = (appealId, horizonId, outcomeDetails) => ({
  pageTitle: 'Invalid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  getText,
  outcomeDetails,
  appealReference: horizonId,
});

const getInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
      casework: { outcomeDetails },
    },
  } = req;
  const options = {
    ...viewData(id, horizonId, outcomeDetails),
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

  const reasons = toArray(body['invalid-appeal-reasons']);
  const otherReason = body['other-reason'];

  const outcomeDetails = {
    reasons,
    otherReason,
  };

  req.session.casework.outcomeDetails = outcomeDetails;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(id, horizonId, outcomeDetails),
  });
};

module.exports = {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
};
