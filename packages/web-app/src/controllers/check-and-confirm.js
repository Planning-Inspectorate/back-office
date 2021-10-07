const {
  questionnairesForReview: previousPage,
  checkAndConfirm: currentPage,
  home: nextPage,
} = require('../config/views');

const getConfirmationSections = async (apealReference) => [
  {
    title: 'Review outcome',
    value: 'Incomplete',
  },
  {
    title: 'Missing or incorrect documents',
    value: [],
  },
  {
    title: 'Appeal reference',
    value: 'APP',
  },
  {
    title: 'Appeal site',
    value: 'site',
  },
  {
    title: 'Local planning department',
    value: 'Newark and Sherwood District Council',
  },
];

const getCheckAndConfirm = async (req, res) => {
  const { appealId } = req.query;
  res.render(currentPage, {
    pageTitle: 'Check and confirm',
    sections: await getConfirmationSections(),
    backLink: `/${previousPage}/${appealId}`,
  });
};

const postCheckAndConfirm = (req, res) => {
  res.render(currentPage, {});
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
