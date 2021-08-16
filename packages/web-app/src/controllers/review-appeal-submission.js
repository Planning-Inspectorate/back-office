const views = require('../config/views');

const appealData = {
  horizonId: 'APP/Q9999/D/21/1234567',
  lpaCode: 'Maidstone Borough Council',
  submissionDate: '2021-05-16T12:00:00.000Z',
  aboutYouSection: {
    yourDetails: {
      isOriginalApplicant: true,
      name: 'Manish Sharma',
      appealingOnBehalfOf: 'Jack Pearson',
    },
  },
  requiredDocumentsSection: {
    applicationNumber: '48269/APP/2020/1482',
    originalApplication: {
      uploadedFile: {
        name: 'planning application.pdf',
      },
    },
    decisionLetter: {
      uploadedFile: {
        name: 'decision letter.pdf',
      },
    },
  },
  yourAppealSection: {
    appealStatement: {
      uploadedFile: {
        name: 'appeal statement.pdf',
      },
    },
    otherDocuments: {
      uploadedFiles: [
        {
          name: 'other documents 1.pdf',
        },
        {
          name: 'other documents 2.pdf',
        },
        {
          name: 'other documents 3.pdf',
        },
      ],
    },
  },
  appealSiteSection: {
    siteAddress: {
      addressLine1: '96 The Avenue',
      addressLine2: '',
      town: 'Maidstone',
      county: '',
      postcode: 'XM26 7YS',
    },
  },
};

let viewData = {
  appealData,
  pageTitle: 'Review appeal submission',
  backLink: views.appealsList,
};

const getReviewAppealSubmission = (req, res) => {
  res.render(views.reviewAppealSubmission, viewData);
};

const postReviewAppealSubmission = (req, res) => {
  const { errors = {}, errorSummary = [] } = req.body;

  viewData = {
    ...viewData,
    reviewOutcome: req.body['review-outcome'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(views.reviewAppealSubmission, {
      ...viewData,
      errors,
      errorSummary,
    });
    return;
  }

  res.render(views.reviewAppealSubmission, viewData);
};

module.exports = {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
};
