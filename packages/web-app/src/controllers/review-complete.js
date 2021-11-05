const { reviewComplete: currentPage } = require('../config/views');

const { getText, getReviewOutcomeConfig } = require('../config/review-appeal-submission');

const checkAndConfirmConfig = (casework) => getReviewOutcomeConfig(casework.reviewOutcome);

const viewData = (casework) => ({
  pageTitle: 'Review complete',
  hidePageTitle: 'true',
  reviewComplete: casework,
});

const getReviewComplete = (req, res) => {
  const {
    session: { appeal, casework },
  } = req;

  const options = {
    ...viewData(casework),
    appealData: appeal,
    checkAndConfirmConfig: checkAndConfirmConfig(casework),
    getText,
  };
  res.render(currentPage, options);
};

module.exports = {
  getReviewComplete,
};
