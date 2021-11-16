const {
  getReviewQuestionnaireSubmission,
  postReviewQuestionnaireSubmission,
} = require('./review-questionnaire-submission');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { createPageData } = require('../../test/lib/createPageData');
const mockViewData = require('../../test/review-questionnaire-view-data-mock.json');
const emptyValues = require('../../test/review-questionnaire-empty-values');
const saveAndContinue = require('../lib/save-and-continue');
const { saveAppealData } = require('../lib/api-wrapper');

jest.mock('../lib/api-wrapper');
jest.mock('../lib/save-and-continue');

describe('controllers/review-questionnaire', () => {
  let req;
  let res;
  let viewData;
  let currentPage;
  let nextPage;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();

    viewData = mockViewData.appealInfo;

    nextPage = views.questionnairecheckAndConfirm;
    currentPage = views.reviewQuestionnaireSubmission;
  });

  describe('getReviewQuestionnaire', () => {
    it('should render the view with data correctly', () => {
      const {
        session: { appeal, questionnaire },
      } = req;

      viewData = createPageData(appeal, questionnaire);

      getReviewQuestionnaireSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        pageTitle: 'Review questionnaire',
        ...viewData,
      });
    });

    it('should render the view with data correctly, with differing conditionals', () => {
      const {
        session: { appeal, questionnaire },
      } = req;

      viewData = createPageData(appeal, questionnaire);

      getReviewQuestionnaireSubmission(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        pageTitle: 'Review questionnaire',
        ...viewData,
      });
    });

    it('should render the view with data correctly, with differing conditionals', () => {
      req.session = mockViewData.sessionAlternate;

      const {
        session: { appeal, questionnaire },
      } = req;

      viewData = createPageData(appeal, questionnaire);

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
      const {
        session: { appeal, questionnaire },
      } = req;
      req.body = {};
      viewData = {
        ...createPageData(appeal, questionnaire),
        values: { ...emptyValues },
        pageTitle: 'Review questionnaire',
      };
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
        saveData: saveAppealData,
      });
    });

    it('should redirect with non-empty missing or incorrect documents', () => {
      req.body = {
        'lpaqreview-officer-report-checkbox': 'on',
        'lpaqreview-plans-decision-checkbox': 'on',
        'lpaqreview-application-notification-checkbox': 'on',
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
        saveData: saveAppealData,
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
        saveData: saveAppealData,
      });
    });

    it('should render with previous values present', () => {
      const mockObject = { mock: 'mock' };

      req.body = {
        'lpaqreview-plans-decision-checkbox': 'on',
        'lpaqreview-plans-decision-textarea': 'mock-plans-missing-text',
        'lpaqreview-application-publicity-checkbox': 'on',
        'lpaqreview-appeal-notification-checkbox': 'on',
        'lpaqreview-appeal-notification-subcheckbox2': 'on',
        errorSummary: mockObject,
        errors: mockObject,
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
        saveData: saveAppealData,
      });
    });
  });
});
