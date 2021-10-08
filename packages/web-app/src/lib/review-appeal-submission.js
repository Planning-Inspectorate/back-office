const views = require('../config/views');

const ReviewOutcome = {
  valid: 'valid',
  invalid: 'invalid',
  incomplete: 'incomplete',
};

const missingOrWrongReasons = {
  noApplicationForm: {
    text: 'Application form',
  },
  noDecisionNotice: {
    text: 'Decision notice',
  },
  noGroundsOfAppeal: {
    text: 'Grounds of appeal',
  },
  noSupportingDocuments: {
    text: 'Supporting documents',
  },
  namesNotMatch: {
    text: 'Names do not match',
  },
  sensitiveInformationIncluded: {
    text: 'Sensitive information included',
  },
  missingOrWrongDocuments: {
    text: 'Missing or wrong documents',
  },
  inflammatoryComments: {
    text: 'Inflammatory comments made',
  },
  openedInError: {
    text: 'Opened in error',
  },
  wrongAppealType: {
    text: 'Wrong appeal type used',
  },
  other: {
    text: 'Other',
  },
};

const invalidAppealReasons = {
  outOfTime: {
    text: 'Out of time',
  },
  noRightOfAppeal: {
    text: 'No right of appeal',
  },
  notAppealable: {
    text: 'Not appealable',
  },
  lpaDeemedApplicationAsInvalid: {
    text: 'LPA deemed application as invalid',
  },
  other: {
    text: 'Other',
  },
};

const allText = {
  ...missingOrWrongReasons,
  ...invalidAppealReasons,
};

const getText = (key) => allText[key]?.text || key;

const checkAndConfirmConfigMap = {
  [ReviewOutcome.valid]: {
    text: 'Valid',
    reasonText: 'Description of development',
    view: views.validAppealDetails,
    continueButtonText: 'Confirm and start appeal',
  },
  [ReviewOutcome.invalid]: {
    text: 'Invalid',
    reasonText: 'Reasons',
    view: views.invalidAppealDetails,
    continueButtonText: 'Confirm and turn away appeal',
  },
  [ReviewOutcome.incomplete]: {
    text: 'Something is missing or wrong',
    reasonText: 'Reasons',
    view: views.missingOrWrong,
    continueButtonText: 'Confirm and finish review',
  },
};

const getCheckAndConfirmConfig = (reviewOutcome) => checkAndConfirmConfigMap[reviewOutcome];

module.exports = {
  getCheckAndConfirmConfig,
  getText,
  ReviewOutcome,
};
