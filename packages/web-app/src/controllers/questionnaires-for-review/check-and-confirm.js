const {
  questionnairesForReview: previousPage,
  checkAndConfirm: currentPage,
} = require('../../config/views');

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

const getConfirmationSections = (appealReference, outcome) => {
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

const getBreadcrumbs = () => [
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

const getCheckAndConfirm = (req, res) => {
  const { appealId } = req.param;
  const outcome = reviewOutcome.COMPLETE;

  res.render(currentPage, {
    pageTitle: 'Check and confirm',
    sections: getConfirmationSections(appealId, outcome),
    breadcrumbs: getBreadcrumbs(),
    backLink: `/${previousPage}/${appealId}`,
    reviewOutcome: outcome,
  });
};

module.exports = {
  getCheckAndConfirm,
};
