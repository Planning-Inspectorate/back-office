const views = require('./views');

const reviewOutcomeOption = {
  valid: '1',
  invalid: '2',
  incomplete: '3',
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
  1: {
    text: 'Out of time',
  },
  2: {
    text: 'No right of appeal',
  },
  3: {
    text: 'Not appealable',
  },
  4: {
    text: 'LPA deemed application as invalid',
  },
  5: {
    text: 'Other',
  },
};

const allText = {
  ...missingOrWrongReasons,
  ...invalidAppealReasons,
};

const getText = (key) => allText[key]?.text || key;

const reviewOutcomeConfigMap = {
  [reviewOutcomeOption.valid]: {
    text: 'Valid',
    reasonText: 'Description of development',
    view: views.validAppealDetails,
    continueButtonText: 'Confirm and start appeal',
    reviewCompleteStatusText: 'Appeal valid',
    reviewCompleteText:
      'The appeal has been started and the LPA questionnaire email has been sent.',
  },
  [reviewOutcomeOption.invalid]: {
    text: 'Invalid',
    reasonText: 'Reasons',
    view: views.invalidAppealDetails,
    continueButtonText: 'Confirm and turn away appeal',
    reviewCompleteStatusText: 'Appeal invalid',
    reviewCompleteText:
      'The appeal has been turned away, and emails have been sent to the appellant and LPA.',
  },
  [reviewOutcomeOption.incomplete]: {
    text: 'Something is missing or wrong',
    reasonText: 'Reasons',
    view: views.missingOrWrong,
    continueButtonText: 'Confirm and finish review',
    reviewCompleteStatusText: 'Something is missing or wrong',
    reviewCompleteText: '',
  },
};

const getReviewOutcomeConfig = (reviewOutcome) => reviewOutcomeConfigMap[reviewOutcome];

module.exports = {
  getReviewOutcomeConfig,
  getText,
  reviewOutcomeOption,
};
