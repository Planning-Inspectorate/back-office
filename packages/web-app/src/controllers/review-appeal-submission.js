const {
  appealsList,
  reviewAppealSubmission: currentPage,
  validAppealDetails,
  invalidAppealDetails,
  missingOrWrong,
  home,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { reviewOutcomeOption } = require('../config/review-appeal-submission');
const { hasAppeal } = require('../config/db-fields');

const viewData = (reviewOutcome) => ({
  pageTitle: 'Review appeal submission',
  backLink: `/${appealsList}`,
  reviewOutcome,
});

const getReviewAppealSubmission = (req, res) => {
  const {
    session: {
      appeal,
      casework: { [hasAppeal.reviewOutcome]: reviewOutcome },
    },
  } = req;

  res.render(currentPage, {
    ...viewData(reviewOutcome),
    appealData: appeal,
  });
};

const postReviewAppealSubmission = (req, res) => {
  const reviewOutcome = req.body['review-outcome'];

  let nextPage;
  if (reviewOutcome === reviewOutcomeOption.valid) {
    nextPage = validAppealDetails;
  } else if (reviewOutcome === reviewOutcomeOption.invalid) {
    nextPage = invalidAppealDetails;
  } else if (reviewOutcome === reviewOutcomeOption.incomplete) {
    nextPage = missingOrWrong;
  } else {
    nextPage = home;
  }

  req.session.casework[hasAppeal.reviewOutcome] = reviewOutcome;

  saveAndContinue({ req, res, currentPage, nextPage, viewData: viewData(reviewOutcome) });
};

module.exports = {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
};
