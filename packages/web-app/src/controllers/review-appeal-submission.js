const {
  appealsList,
  reviewAppealSubmission: currentPage,
  validAppealDetails,
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
  const nextPage = reviewOutcome === 'valid' ? validAppealDetails : home;

  req.session.appeal.casework.reviewOutcome = reviewOutcome;

  saveAndContinue({ req, res, currentPage, nextPage, viewData: viewData(reviewOutcome) });
};

module.exports = {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
};
