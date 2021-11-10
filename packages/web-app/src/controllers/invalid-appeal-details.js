const toArray = require('../lib/to-array');
const {
  reviewAppealSubmission: previousPage,
  invalidAppealDetails: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { getText } = require('../config/review-appeal-submission');
const { hasAppeal } = require('../config/db-fields');

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
      casework: {
        [hasAppeal.invalidAppealReasons]: reasons,
        [hasAppeal.invalidReasonOther]: otherReason,
      },
    },
  } = req;
  const options = {
    ...viewData(appealId, caseReference, { reasons, otherReason }),
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

  casework[hasAppeal.invalidAppealReasons] = JSON.stringify(reasons);
  casework[hasAppeal.invalidReasonOther] = otherReason;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(appealId, caseReference, { reasons, otherReason }),
  });
};

module.exports = {
  getInvalidAppealDetails,
  postInvalidAppealDetails,
};
