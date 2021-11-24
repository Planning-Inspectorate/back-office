const toArray = require('../lib/to-array');
const { labels } = require('../config/review-appeal-submission');
const { saveAppealData } = require('../lib/api-wrapper');
const { hasAppeal } = require('../config/db-fields');

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
  labels,
});

const getMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework: {
        [hasAppeal.missingOrWrongReasons]: reasons,
        [hasAppeal.missingOrWrongDocuments]: documentReasons,
        [hasAppeal.missingOrWrongOtherReason]: otherReason,
      },
    },
  } = req;

  res.render(
    currentPage,
    viewData(appealId, caseReference, { reasons, documentReasons, otherReason })
  );
};

const postMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework,
    },
    body,
  } = req;

  const reasons = toArray(body['missing-or-wrong-reasons']);
  const documentReasons = toArray(body['missing-or-wrong-documents']);
  const otherReason = body['other-reason'];

  casework[hasAppeal.missingOrWrongReasons] = JSON.stringify(reasons);
  casework[hasAppeal.missingOrWrongDocuments] = JSON.stringify(documentReasons);
  casework[hasAppeal.missingOrWrongOtherReason] = otherReason;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(appealId, caseReference, {
      reasons,
      documentReasons,
      otherReason,
    }),
    saveData: saveAppealData,
  });
};

module.exports = {
  getMissingOrWrong,
  postMissingOrWrong,
};
