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
      appeal: { appealId, caseReference },
      casework: { missingOrWrong },
    },
  } = req;

  res.render(currentPage, viewData(appealId, caseReference, missingOrWrong));
};

const postMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework,
    },
    body,
  } = req;

  const missingOrWrong = {
    reasons: toArray(body['missing-or-wrong-reasons']),
    documentReasons: toArray(body['missing-or-wrong-documents']),
    otherReason: body['other-reason'],
  };

  casework.missingOrWrong = missingOrWrong;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(appealId, caseReference, missingOrWrong),
  });
};

module.exports = {
  getMissingOrWrong,
  postMissingOrWrong,
};
