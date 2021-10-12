const {
  questionnairesForReview: previousPage,
  checkAndConfirm: currentPage,
  home: nextPage,
} = require('../config/views');

const reviewOutcome = {
  COMPLETE: 'COMPLETE',
  INCOMPLETE: 'INCOMPLETE',
};

const sections = [
  {
    title: 'Review outcome',
    value: 'Complete',
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

const getConfirmationSections = async (appealReference, outcome) => {
  switch (outcome) {
    case reviewOutcome.INCOMPLETE: {
      sections.push({
        title: 'Missing or incorrect documents',
        value: [],
      });
      return sections;
    }

    default:
      return sections;
  }
};

const getBreadcrumbs = async () => [
  {
    title: 'Case officer dashboard',
  },
  {
    title: 'Questionnaires for review',
  },
  {
    title: 'Dummy Appeal Reference',
  },
  {
    title: 'Check and confirm',
  },
];

const getCheckAndConfirm = async (req, res) => {
  const { appealId } = req.param;
  const outcome = reviewOutcome.COMPLETE;

  res.render(currentPage, {
    pageTitle: 'Check and confirm',
    sections: await getConfirmationSections(appealId, outcome),
    breadcrumbs: await getBreadcrumbs(),
    backLink: `/${previousPage}/${appealId}`,
    reviewOutcome: outcome,
  });
};
/*
const updateQuestionnaireStatus = async (appealId) => ({
  appealId,
  status: 'Available for inspector',
  timestamp: new Date().toISOString(),
});

const postCheckAndConfirm = async (req, res) => {
  const { appealId } = req.param;
  if (typeof appealId !== 'undefined') throw Error('appeal id is undefined');
  await updateQuestionnaireStatus(appealId);
  res.render('check-and-confirm', {});
};
*/
module.exports = {
  getCheckAndConfirm,
};
