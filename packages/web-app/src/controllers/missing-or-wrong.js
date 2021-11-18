const toArray = require('../lib/to-array');
const { getText } = require('../config/review-appeal-submission');
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
  getText,
});

const getMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: { appealId, caseReference },
      casework: {
        [hasAppeal.invalidAppealReasons]: reasons,
        [hasAppeal.invalidReasonOther]: otherReason,
      },
    },
  } = req;

  res.render(currentPage, viewData(appealId, caseReference, { reasons, otherReason }));
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

  casework[hasAppeal.invalidAppealReasons] = JSON.stringify([...reasons, ...documentReasons]);
  casework[hasAppeal.invalidReasonOther] = otherReason;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(appealId, caseReference, {
      reasons: [...reasons, ...documentReasons],
      otherReason,
    }),
    saveData: saveAppealData,
  });
};

module.exports = {
  getMissingOrWrong,
  postMissingOrWrong,
};
