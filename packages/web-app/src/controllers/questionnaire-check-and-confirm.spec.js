const checkAndConfirmController = require('./questionnaire-check-and-confirm');
const {
  reviewQuestionnaire: previousPage,
  reviewQuestionnaireComplete: nextPage,
} = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

describe('controllers/questionnaire-check-and-confirm', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getCheckAndConfirm', () => {
    it('should render view with complete status', async () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'COMPLETE',
            missingOrIncorrectDocuments: [],
          },
        },
      };

      const appealId = req.session.appeal.id;

      const siteAddress = {
        address1: 'Jaleno',
        address2: 'Church Lane',
        town: 'Eakring',
        city: 'NEWARK',
        postcode: 'NG22 ODH',
      };

      const sections = [
        {
          key: {
            text: 'Review outcome',
          },
          value: {
            text: 'Complete',
          },
        },
        {
          key: {
            text: 'Appeal reference',
          },
          value: {
            text: 'APP/Q9999/D/21/1224115',
          },
        },
        {
          key: {
            text: 'Appeal site',
          },
          value: {
            html: checkAndConfirmController.util.compileAddress(siteAddress),
          },
        },
        {
          key: {
            text: 'Local planning department',
          },
          value: {
            text: 'Newark and Sherwood District Council',
          },
        },
      ];

      const breadcrumbs = [
        {
          text: 'Questionnaires for review',
          href: '/planning-inspectorate/appeals/questionnaires-for-review',
        },
        {
          text: 'APP/Q9999/D/21/1224115',
          href: `/planning-inspectorate/appeals/questionnaires-for-review/review/${appealId}`,
        },
        {
          text: 'Check and confirm',
          href: `/planning-inspectorate/appeals/questionnaires-for-review/check-and-confirm/${appealId}`,
        },
      ];

      checkAndConfirmController.getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        breadcrumbs,
        sections: {
          rows: sections,
        },
        pageTitle: 'Review questionnaire',
        previousPage,
        reviewOutcome: 'COMPLETE',
      });
    });

    it('should render view with incomplete status', () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'INCOMPLETE',
            missingOrIncorrectDocuments: ["Planning Officer's report", 'Application publicity'],
          },
        },
      };

      const appealId = req.session.appeal.id;
      const { missingOrIncorrectDocuments } = req.session.questionnaire;

      const siteAddress = {
        address1: 'Jaleno',
        address2: 'Church Lane',
        town: 'Eakring',
        city: 'NEWARK',
        postcode: 'NG22 ODH',
      };

      const sections = [
        {
          key: {
            text: 'Review outcome',
          },
          value: {
            text: 'Incomplete',
          },
        },
        {
          key: {
            text: 'Missing or incorrect documents',
          },
          value: {
            html: checkAndConfirmController.util.compileMissingDocuments(
              missingOrIncorrectDocuments
            ),
          },
        },
        {
          key: {
            text: 'Appeal reference',
          },
          value: {
            text: 'APP/Q9999/D/21/1224115',
          },
        },
        {
          key: {
            text: 'Appeal site',
          },
          value: {
            html: checkAndConfirmController.util.compileAddress(siteAddress),
          },
        },
        {
          key: {
            text: 'Local planning department',
          },
          value: {
            text: 'Newark and Sherwood District Council',
          },
        },
      ];

      const breadcrumbs = [
        {
          text: 'Questionnaires for review',
          href: '/planning-inspectorate/appeals/questionnaires-for-review',
        },
        {
          text: 'APP/Q9999/D/21/1224115',
          href: `/planning-inspectorate/appeals/questionnaires-for-review/review/${appealId}`,
        },
        {
          text: 'Check and confirm',
          href: `/planning-inspectorate/appeals/questionnaires-for-review/check-and-confirm/${appealId}`,
        },
      ];

      checkAndConfirmController.getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        breadcrumbs,
        sections: {
          rows: sections,
        },
        pageTitle: 'Review questionnaire',
        previousPage,
        reviewOutcome: 'INCOMPLETE',
      });
    });
  });

  describe('postCheckAndConfirm', () => {
    it('should redirect to review outcomepage', () => {
      req = {
        session: {
          appeal: { id: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'COMPLETE',
            missingOrIncorrectDocuments: [],
          },
        },
      };
      checkAndConfirmController.postCheckAndConfirm(req, res);

      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${nextPage}`);
    });
  });
});
