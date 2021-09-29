const {
  appealsList,
  reviewAppealSubmission: currentPage,
  validAppealDetails,
  invalidAppealDetails,
  missingOrWrong,
  home,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');

const viewData = (reviewOutcome) => ({
  pageTitle: 'Review appeal submission',
  backLink: `/${appealsList}`,
  reviewOutcome,
});

const getReviewAppealSubmission = (req, res) => {
  const {
    session: {
      appeal: {
        appeal,
        casework: { reviewOutcome },
      },
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
  if (reviewOutcome === 'valid') {
    nextPage = validAppealDetails;
  } else if (reviewOutcome === 'invalid') {
    nextPage = invalidAppealDetails;
  } else if (reviewOutcome === 'incomplete') {
    nextPage = missingOrWrong;
  } else {
    nextPage = home;
  }

  req.session.appeal.casework.reviewOutcome = reviewOutcome;

  saveAndContinue({ req, res, currentPage, nextPage, viewData: viewData(reviewOutcome) });
};

module.exports = {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
};
