const {
  questionnairesForReview: previousPage,
  checkAndConfirm: currentPage,
  home: nextPage,
} = require('../config/views');

const getConfirmationSections = async (appealReference) => [
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
    value: 'Site',
  },
  {
    title: 'Local planning department',
    value: 'Newark and Sherwood District Council',
  },
];

const getCheckAndConfirm = async (req, res) => {
  const { appealId } = req.param;

  res.render(currentPage, {
    pageTitle: 'Check and confirm',
    sections: await getConfirmationSections(),
    backLink: `/${previousPage}/${appealId}`,
  });
};

const updateQuestionnaireStatus = async (appealId) => ({
  appealId,
  status: 'Available for inspector',
  timestamp: new Date().toISOString(),
});

const postCheckAndConfirm = async (req, res) => {
  const { appealId } = req.param;
  if (typeof appealId !== 'undefined') throw Error('appeal id is undefined');
  await updateQuestionnaireStatus(appealId);

  res.render(currentPage, {});
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
