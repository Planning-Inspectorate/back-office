const toArray = require('../lib/to-array');
const {
  reviewAppealSubmission: previousPage,
  invalidAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { getText } = require('../config/review-appeal-submission');

const viewData = (appealId, horizonId, invalid) => ({
  pageTitle: 'Invalid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  getText,
  invalid,
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
    ...viewData(id, horizonId, outcomeDetails?.invalid),
    getText,
  };
  res.render(currentPage, options);
};

const postInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { id, horizonId },
      casework,
    },
    body,
  } = req;

  const reasons = toArray(body['invalid-appeal-reasons']);
  const otherReason = body['other-reason'];

  const outcomeDetails = {
    invalid: {
      reasons,
      otherReason,
    },
  };

  casework.outcomeDetails = outcomeDetails;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(id, horizonId, outcomeDetails.invalid),
  });
};

module.exports = {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
};
