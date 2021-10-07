const { appealAlreadyReviewed, appealsList } = require('../config/views');

const mapStatusMessage = (reviewOutcome) =>
  ({
    valid: 'this appeal is valid',
    invalid: 'this appeal is invalid',
    incomplete: 'that something is missing or wrong',
  }[reviewOutcome]);

const getAppealAlreadyReviewed = (req, res) => {
  const {
    session: {
      casework: { reviewer: { name: reviewerName } = {}, reviewOutcome },
    },
  } = req;
  const statusMessage = mapStatusMessage(reviewOutcome);

  if (reviewerName && statusMessage) {
    return res.render(appealAlreadyReviewed, {
      pageTitle: 'Appeal already reviewed',
      reviewerName,
      statusMessage,
    });
  }

  return res.redirect(`/${appealsList}`);
};

module.exports = {
  getAppealAlreadyReviewed,
};
