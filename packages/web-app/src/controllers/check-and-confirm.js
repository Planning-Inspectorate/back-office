const {
  questionnairesForReview: previousPage,
  checkAndConfirm: currentPage,
  home: nextPage,
} = require('../config/views');

const getCheckAndConfirm = (req, res) => {
  const {
    session: {},
  } = req;

  res.render(currentPage, {});
};

const postCheckAndConfirm = (req, res) => {
  res.render(currentPage, {});
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
