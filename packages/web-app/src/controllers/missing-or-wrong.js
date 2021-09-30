const { toArray } = require('@pins/common/src/utils');
const {
  reviewAppealSubmission: previousPage,
  missingOrWrong: currentPage,
  home: nextPage,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (appealId, horizonId, outcomeDetails) => ({
  pageTitle: 'What is missing or wrong?',
  backLink: `/${previousPage}/${appealId}`,
  outcomeDetails,
  appealReference: horizonId,
});

const getMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: {
        appeal: { id, horizonId },
        casework: { outcomeDetails },
      },
    },
  } = req;

  res.render(currentPage, viewData(id, horizonId, outcomeDetails));
};

const postMissingOrWrong = (req, res) => {
  const {
    session: {
      appeal: {
        appeal: { id, horizonId },
      },
    },
    body,
  } = req;

  const reasons = toArray(body['missing-or-wrong-reasons']);
  const documentReasons = toArray(body['missing-or-wrong-documents']);

  reasons.push(...documentReasons);

  const otherReason = body['other-reason'];

  const outcomeDetails = {
    reasons,
    otherReason,
  };

  req.session.appeal.casework.outcomeDetails = outcomeDetails;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: viewData(id, horizonId, outcomeDetails),
  });
};

module.exports = {
  getMissingOrWrong,
  postMissingOrWrong,
};
