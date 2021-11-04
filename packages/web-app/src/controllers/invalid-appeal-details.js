const toArray = require('../lib/to-array');
const {
  reviewAppealSubmission: previousPage,
  invalidAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { getText } = require('../config/review-appeal-submission');

const viewData = (appealId, caseReference, invalid) => ({
  pageTitle: 'Invalid appeal details',
  backLink: `/${previousPage}/${appealId}`,
  getText,
  invalid,
  appealReference: caseReference,
});

const getInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework: { outcomeDetails },
    },
  } = req;
  const options = {
    ...viewData(appealId, caseReference, outcomeDetails?.invalid),
    getText,
  };
  res.render(currentPage, options);
};

const postInvalidAppealDetails = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
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
    viewData: viewData(appealId, caseReference, outcomeDetails.invalid),
  });
};

module.exports = {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
};
