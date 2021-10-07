const views = require('../config/views');

const handleAppealAlreadyReviewed = (req, res, next) => {
  const {
    session: {
      appeal: { state },
    },
  } = req;

  return state && state !== 'Appeal Received'
    ? res.redirect(`/${views.appealAlreadyReviewed}`)
    : next();
};

module.exports = handleAppealAlreadyReviewed;
