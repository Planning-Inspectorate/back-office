const addBusinessDays = require('date-fns/addBusinessDays');
const {
  checkAndConfirm: currentPage,
  reviewComplete: nextPage,
  reviewAppealSubmission,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const {
  labels,
  getReviewOutcomeConfig,
  reviewOutcomeOption,
} = require('../config/review-appeal-submission');
const { sendStartEmailToLPA } = require('../lib/notify');
const { hasAppeal, appealLink } = require('../config/db-fields');
const { saveAppealData, saveAppealLinkData } = require('../lib/api-wrapper');

const viewData = (appealId, casework) => {
  const validAppealDetails = casework[hasAppeal.validAppealDetails];
  const invalidAppealReasons = casework[hasAppeal.invalidAppealReasons];
  const missingOrWrongReasons = casework[hasAppeal.missingOrWrongReasons];
  const missingOrWrongDocuments = casework[hasAppeal.missingOrWrongDocuments];
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

  if (missingOrWrongReasons) {
    data.missingOrWrongDetails = {
      reasons: missingOrWrongReasons && JSON.parse(missingOrWrongReasons),
      documentReasons: missingOrWrongDocuments && JSON.parse(missingOrWrongDocuments),
      otherReason: casework[hasAppeal.missingOrWrongOtherReason],
    };
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
    labels,
  };

  res.render(currentPage, options);
};

const postCheckAndConfirm = async (req, res) => {
  const {
    session: { appeal, casework },
  } = req;

  casework.completed = req.body['check-and-confirm-completed'];

  switch (casework[hasAppeal.reviewOutcome]) {
    case reviewOutcomeOption.valid:
      await sendStartEmailToLPA(appeal);
      await saveAppealLinkData({
        appealId: appeal.appealId,
        [appealLink.questionnaireStatusId]: 1,
        [appealLink.caseStatusId]: 2,
      });
      casework[hasAppeal.appealStartDate] = new Date();
      casework[hasAppeal.questionnaireDueDate] = addBusinessDays(new Date(), 5);
      casework[hasAppeal.appealValidDate] = appeal.submissionDate;
      break;
    case reviewOutcomeOption.invalid:
      await saveAppealLinkData({
        appealId: appeal.appealId,
        [appealLink.caseStatusId]: 3,
      });
      casework[hasAppeal.appealValidationDate] = new Date();
      break;
    case reviewOutcomeOption.incomplete:
      await saveAppealLinkData({
        appealId: appeal.appealId,
        [appealLink.caseStatusId]: 4,
      });
      casework[hasAppeal.appealValidationDate] = new Date();
      break;
    default:
      throw new Error('No review outcome set');
  }

  const options = {
    ...viewData(appeal.appealId, casework),
    appealData: appeal,
    checkAndConfirmConfig: getReviewOutcomeConfig(casework[hasAppeal.reviewOutcome]),
    labels,
  };

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: options,
    saveData: saveAppealData,
  });
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
