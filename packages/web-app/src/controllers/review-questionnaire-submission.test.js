const {
  getReviewQuestionnaireSubmission,
  postReviewQuestionnaireSubmission,
} = require('./review-questionnaire-submission');
const views = require('../config/views');
const { getAppealData } = require('../lib/api-wrapper');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const mockExistingData = require('../../test/review-questionnaire-existing-data-mock.json');
const mockViewData = require('../../test/review-questionnaire-view-data-mock.json');
const emptyValues = require('../../test/review-questionnaire-empty-values');
const saveAndContinue = require('../lib/save-and-continue');

jest.mock('../lib/api-wrapper');
jest.mock('../lib/save-and-continue');

describe('controllers/review-questionnaire', () => {
  let req;
  let res;
  let existingData;
  let viewData;
  let currentPage;
  let nextPage;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();

    existingData = mockExistingData;
    viewData = mockViewData;

    nextPage = views.questionnairecheckAndConfirm;
    currentPage = views.reviewQuestionnaireSubmission;
  });

  describe('getReviewQuestionnaire', () => {
    it('should render the view with data correctly', () => {
      getAppealData.mockImplementation(() => existingData);

      const req = {
        session: {
          appeal: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
        },
      };

      getReviewQuestionnaireSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        ...viewData,
      });
    });

    it('should render the view with data correctly, with differing conditionals', () => {
      const req = {
        session: {
          appeal: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
        },
      };

      existingData.questionnaire.nearConservationArea = false;
      existingData.questionnaire.listedBuilding.affectSetting = false;

      viewData.aboutAppealSite.developmentAffectSettings.cellText = 'No';
      viewData.aboutAppealSite.nearConservationArea.cellText = 'No';

      getAppealData.mockImplementation(() => existingData);

      getReviewQuestionnaireSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        pageTitle: 'Review questionnaire',
        ...viewData,
      });
    });
  });

  describe('postReviewQuestionnaire', () => {
    beforeEach(() => {
      req.body = {};
      viewData = { ...mockViewData, values: { ...emptyValues }, pageTitle: 'Review questionnaire' };
    });

    it('should redirect with no missing or incorrect documents', () => {
      postReviewQuestionnaireSubmission(req, res);

      expect(req.session.questionnaire.missingOrIncorrectDocuments).toEqual([]);
      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage,
        nextPage,
        viewData,
      });
    });

    it('should redirect with non-empty missing or incorrect documents', () => {
      const req = {
        body: {
          'lpaqreview-officer-report-checkbox': 'on',
          'lpaqreview-plans-decision-checkbox': 'on',
          'lpaqreview-application-notification-checkbox': 'on',
        },
        session: {
          appeal: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'INCOMPLETE',
            missingOrIncorrectDocuments: [
              "Planning Officer's report",
              'Plans used to reach the decision:',
              'Application notification:',
            ],
          },
        },
      };

      viewData.values['lpaqreview-application-notification-checkbox'] = 'on';
      viewData.values['lpaqreview-officer-report-checkbox'] = 'on';
      viewData.values['lpaqreview-plans-decision-checkbox'] = 'on';

      postReviewQuestionnaireSubmission(req, res);

      expect(req.session.questionnaire.missingOrIncorrectDocuments).toEqual([
        "Planning Officer's report",
        'Plans used to reach the decision:',
        'Application notification:',
      ]);
      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage,
        nextPage,
        viewData,
      });
    });

    it('should render with errors', () => {
      const errorSummary = [
        {
          text: 'Enter which plans are missing',
          href: '#lpaqreview-plans-decision-textarea',
        },
        {
          text: 'Select which application notification is missing or incorrect',
          href: '#lpaqreview-application-notification-checkbox',
        },
      ];

      const errors = {
        'lpaqreview-plans-decision-textarea': {
          value: '',
          msg: 'Enter which plans are missing',
          param: 'lpaqreview-plans-decision-textarea',
          location: 'body',
        },
        'lpaqreview-application-notification-checkbox': {
          value: 'on',
          msg: 'Select which application notification is missing or incorrect',
          param: 'lpaqreview-application-notification-checkbox',
          location: 'body',
        },
      };

      req.body = { errors, errorSummary };

      postReviewQuestionnaireSubmission(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage,
        nextPage,
        viewData,
      });
    });

    it('should render with previous values present', () => {
      const mockObject = { mock: 'mock' };

      const req = {
        body: {
          'lpaqreview-plans-decision-checkbox': 'on',
          'lpaqreview-plans-decision-textarea': 'mock-plans-missing-text',
          'lpaqreview-application-publicity-checkbox': 'on',
          'lpaqreview-appeal-notification-checkbox': 'on',
          'lpaqreview-appeal-notification-subcheckbox2': 'on',
          errorSummary: mockObject,
          errors: mockObject,
        },
        session: {
          appeal: { appealId: '5c943cb9-e029-4094-a447-4b3256d6ede7' },
          questionnaire: {
            outcome: 'Incomplete',
            missingOrIncorrectDocuments: [
              'Plans used to reach the decision:',
              'mock-plans-missing-text',
              'Application publicity',
              'Appeal notification:',
              'Copy of letter or site notice',
            ],
          },
        },
      };

      viewData.values['lpaqreview-plans-decision-checkbox'] = 'on';
      viewData.values['lpaqreview-plans-decision-textarea'] = 'mock-plans-missing-text';
      viewData.values['lpaqreview-application-publicity-checkbox'] = 'on';
      viewData.values['lpaqreview-appeal-notification-checkbox'] = 'on';
      viewData.values['lpaqreview-appeal-notification-subcheckbox2'] = 'on';

      postReviewQuestionnaireSubmission(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage,
        nextPage,
        viewData,
      });
    });
  });
});
