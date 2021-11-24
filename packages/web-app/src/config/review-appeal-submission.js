const views = require('./views');

const reviewOutcomeOption = {
  valid: '1',
  invalid: '2',
  incomplete: '3',
};

const labels = {
  missingOrWrongReasons: {
    1: 'Names do not match',
    2: 'Sensitive information included',
    3: 'Missing or wrong documents',
    4: 'Inflammatory comments made',
    5: 'Opened in error',
    6: 'Wrong appeal type used',
    7: 'Other',
  },
  missingOrWrongDocuments: {
    1: 'Application form',
    2: 'Decision notice',
    3: 'Grounds of appeal',
    4: 'Supporting documents',
  },
  invalidAppealReasons: {
    1: 'Out of time',
    2: 'No right of appeal',
    3: 'Not appealable',
    4: 'LPA deemed application as invalid',
    5: 'Other',
  },
};

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
  labels,
  reviewOutcomeOption,
};
