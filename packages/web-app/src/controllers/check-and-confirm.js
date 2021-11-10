const {
  checkAndConfirm: currentPage,
  reviewComplete: nextPage,
  reviewAppealSubmission,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const {
  getText,
  getReviewOutcomeConfig,
  reviewOutcomeOption,
} = require('../config/review-appeal-submission');
const { sendStartEmailToLPA } = require('../lib/notify');
const { hasAppeal } = require('../config/db-fields');

const viewData = (appealId, casework) => {
  const validAppealDetails = casework[hasAppeal.validAppealDetails];
  const invalidAppealReasons = casework[hasAppeal.invalidAppealReasons];
  const missingOrWrongDetails = casework.missingOrWrong;
  const data = {
    pageTitle: 'Check and confirm',
    backLink: `/${getReviewOutcomeConfig(casework[hasAppeal.reviewOutcome]).view}`,
    changeOutcomeLink: `/${reviewAppealSubmission}/${appealId}`,
    reviewOutcome: casework[hasAppeal.reviewOutcome],
  };

  if (validAppealDetails) {
    data.validAppealDetails = validAppealDetails;
  }

  if (invalidAppealReasons) {
    data.invalidAppealDetails = {
      reasons: invalidAppealReasons && JSON.parse(invalidAppealReasons),
      otherReason: casework[hasAppeal.invalidReasonOther],
    };
  }

  if (missingOrWrongDetails) {
    data.missingOrWrongDetails = missingOrWrongDetails;
  }

  return data;
};

const getCheckAndConfirm = (req, res) => {
  const {
    session: { appeal, casework },
  } = req;

  const options = {
    ...viewData(appeal.appealId, casework),
    appealData: appeal,
    checkAndConfirmConfig: getReviewOutcomeConfig(casework[hasAppeal.reviewOutcome]),
    getText,
  };

  res.render(currentPage, options);
};

const postCheckAndConfirm = async (req, res) => {
  const {
    session: { appeal, casework },
  } = req;

  req.session.casework.completed = req.body['check-and-confirm-completed'];

  const options = {
    ...viewData(appeal.appealId, casework),
    appealData: appeal,
    checkAndConfirmConfig: getReviewOutcomeConfig(casework[hasAppeal.reviewOutcome]),
    getText,
  };

  if (casework[hasAppeal.reviewOutcome] === reviewOutcomeOption.valid) {
    await sendStartEmailToLPA(appeal);
  }

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: options,
  });
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
