const { getReviewQuestionnaire, postReviewQuestionnaire } = require('./review-questionnaire');
const views = require('../config/views');
const { getData } = require('../lib/api-wrapper');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const mockExistingData = require('../../test/review-questionnaire-existing-data-mock.json');
const mockViewData = require('../../test/review-questionnaire-view-data-mock.json');
const emptyValues = require('../../test/review-questionnaire-empty-values');

jest.mock('../lib/api-wrapper');

describe('controllers/review-questionnaire', () => {
  let req;
  let res;
  let existingData;
  let viewData;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();

    existingData = mockExistingData;
    viewData = mockViewData;

    req.params.id = 'mock-appeal-id';
  });

  describe('getReviewQuestionnaire', () => {
    it('should render the view with data correctly', () => {
      getData.mockImplementation(() => existingData);

      getReviewQuestionnaire(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewQuestionnaire, {
        pageTitle: 'Review questionnaire',
        data: viewData,
      });
    });

    it('should render the view with data correctly, with differing conditionals', () => {
      existingData.questionnaire.nearConservationArea = false;
      existingData.questionnaire.listedBuilding.affectSetting = false;

      viewData.aboutAppealSite.developmentAffectSettings.cellText = 'No';
      viewData.aboutAppealSite.nearConservationArea.cellText = 'No';

      getData.mockImplementation(() => existingData);

      getReviewQuestionnaire(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.reviewQuestionnaire, {
        pageTitle: 'Review questionnaire',
        data: viewData,
      });
    });
  });

  describe('postReviewQuestionnaire', () => {
    beforeEach(() => {
      req.body = {};
    });

    it('should redirect with no missing or incorrect documents', () => {
      postReviewQuestionnaire(req, res);

      expect(req.session.questionnaire.missingOrIncorrectDocuments).toEqual([]);
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(
        `/questionnaires-for-review/check-and-confirm/mock-appeal-id`
      );
    });

    it('should redirect with non-empty missing or incorrect documents', () => {
      req.body = {
        'lpaqreview-officer-report-checkbox': 'on',
        'lpaqreview-plans-decision-checkbox': 'on',
        'lpaqreview-application-notification-checkbox': 'on',
      };

      postReviewQuestionnaire(req, res);

      expect(req.session.questionnaire.missingOrIncorrectDocuments).toEqual([
        "Planning Officer's report",
        'Plans used to reach the decision',
        'Application notification',
      ]);
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(
        `/questionnaires-for-review/check-and-confirm/mock-appeal-id`
      );
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

      postReviewQuestionnaire(req, res);

      expect(res.render).toBeCalledWith(views.reviewQuestionnaire, {
        pageTitle: 'Review questionnaire',
        data: viewData,
        errorSummary,
        errors,
        values: emptyValues,
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

      const values = emptyValues;

      values['lpaqreview-plans-decision-checkbox'] = 'on';
      values['lpaqreview-plans-decision-textarea'] = 'mock-plans-missing-text';
      values['lpaqreview-application-publicity-checkbox'] = 'on';
      values['lpaqreview-appeal-notification-checkbox'] = 'on';
      values['lpaqreview-appeal-notification-subcheckbox2'] = 'on';

      postReviewQuestionnaire(req, res);

      expect(res.render).toBeCalledWith(views.reviewQuestionnaire, {
        pageTitle: 'Review questionnaire',
        data: viewData,
        errorSummary: mockObject,
        errors: mockObject,
        values,
      });
    });
  });
});
