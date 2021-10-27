const getCheckAndConfirmController = require('./questionnaire-check-and-confirm');

describe('controllers/questionnaire-check-and-confirm', () => {
  describe('getCheckAndConfirm', () => {
    it('should render view with complete status', async () => {
      const appealId = '1';

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
            html: getCheckAndConfirmController.util.compileAddress(siteAddress),
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

      const req = {
        params: {
          appealId,
        },
        session: {
          outcome: 'COMPLETE',
        },
      };
      const res = {
        render: jest.fn(),
      };

      getCheckAndConfirmController.getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        breadcrumbs,
        sections: {
          rows: sections,
        },
        pageTitle: 'Review questionnaire',
        reviewOutcome: 'COMPLETE',
      });
    });

    it('should render view with incomplete status', () => {
      const appealId = '2';

      const siteAddress = {
        address1: 'Jaleno',
        address2: 'Church Lane',
        town: 'Eakring',
        city: 'NEWARK',
        postcode: 'NG22 ODH',
      };

      const documents = ['Passport', 'Birth certificate'];

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
            html: getCheckAndConfirmController.util.compileMissingDocuments(documents),
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
            html: getCheckAndConfirmController.util.compileAddress(siteAddress),
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

      const req = {
        params: {
          appealId,
        },
        session: {
          outcome: 'INCOMPLETE',
        },
      };
      const res = {
        render: jest.fn(),
      };

      getCheckAndConfirmController.getCheckAndConfirm(req, res);
      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith('questionnaire-check-and-confirm', {
        breadcrumbs,
        sections: {
          rows: sections,
        },
        pageTitle: 'Review questionnaire',
        reviewOutcome: 'INCOMPLETE',
      });
    });
  });
});
