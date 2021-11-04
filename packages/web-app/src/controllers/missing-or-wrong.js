const toArray = require('../lib/to-array');
const { getText } = require('../config/review-appeal-submission');

const {
  reviewAppealSubmission: previousPage,
  missingOrWrong: currentPage,
  checkAndConfirm: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (appealId, caseReference, missingOrWrong) => ({
  pageTitle: 'What is missing or wrong?',
  backLink: `/${previousPage}/${appealId}`,
  missingOrWrong,
  appealReference: caseReference,
  getText,
});

const getMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: { id, caseReference },
      casework: { outcomeDetails },
    },
  } = req;

  res.render(currentPage, viewData(id, caseReference, outcomeDetails?.missingOrWrong));
};

const postMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: { id, caseReference },
      casework,
    },
    body,
  } = req;

  const reasons = toArray(body['missing-or-wrong-reasons']);
  const documentReasons = toArray(body['missing-or-wrong-documents']);

  const otherReason = body['other-reason'];

  const outcomeDetails = {
    missingOrWrong: {
      reasons,
      documentReasons,
      otherReason,
    },
  };

  casework.outcomeDetails = outcomeDetails;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(id, caseReference, outcomeDetails.missingOrWrong),
  });
};

module.exports = {
  getMissingOrWrong,
  postMissingOrWrong,
};
