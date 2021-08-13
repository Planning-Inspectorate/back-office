const {
  getReviewAppealSubmission,
  postReviewAppealSubmission,
} = require('./review-appeal-submission');
const views = require('../config/views');

describe('controllers/review-appeal-submission', () => {
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

  describe('getReviewAppealSubmission', () => {
    it('should render the view with data correctly', () => {
      const req = {};
      const res = {
        render: jest.fn(),
      };

      getReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        appealData,
        pageTitle: 'Review appeal submission',
        backLink: views.appealsList,
      });
    });
  });

  describe('postReviewAppealSubmission', () => {
    it('should render the view with data correctly', () => {
      const req = {
        body: {},
      };
      const res = {
        render: jest.fn(),
      };

      postReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        appealData,
        pageTitle: 'Review appeal submission',
        backLink: views.appealsList,
      });
    });

    it('should render the view with an error and data correctly', () => {
      const errors = {
        'review-outcome': {
          value: undefined,
          msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
          param: 'review-outcome',
          location: 'body',
        },
      };
      const errorSummary = [
        {
          text: errors['review-outcome'].msg,
          href: `#${errors['review-outcome'].param}`,
        },
      ];
      const req = {
        body: {
          errors,
          errorSummary,
        },
      };
      const res = {
        render: jest.fn(),
      };

      postReviewAppealSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewAppealSubmission, {
        appealData,
        pageTitle: 'Review appeal submission',
        backLink: views.appealsList,
        errors,
        errorSummary,
      });
    });
  });
});
