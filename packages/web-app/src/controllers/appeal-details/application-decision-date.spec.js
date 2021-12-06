const {
  getApplicationDecisionDate,
  postApplicationDecisionDate,
} = require('./application-decision-date');
const views = require('../../config/views');
const saveAndContinue = require('../../lib/save-and-continue');
const { mockReq, mockRes } = require('../../../test/utils/mocks');
const { hasAppealSubmission } = require('../../config/db-fields');
const { saveAppealSubmissionData } = require('../../lib/api-wrapper');
const { appealDetails } = require('../../config/views');

jest.mock('../../lib/save-and-continue');
jest.mock('../../lib/api-wrapper');

describe('controllers/appeal-details/application-decision-date', () => {
  let req;
  let res;

  const appealId = 'ff5fe7af-e69c-4c0e-9d78-70890b2a6e31';
  const appealDecisionDate = '2021-11-19T00:00:00.000Z';

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getApplicationDecisionDate', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appealDecisionDate,
          },
        },
      };

      getApplicationDecisionDate(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.applicationDecisionDate, {
        decisionDate: {
          day: '19',
          month: '11',
          year: 2021,
        },
      });
    });
  });

  describe('postApplicationDecisionDate', () => {
    const newDecisionDateDay = '20';
    const newDecisionDateMonth = '10';
    const newDecisionDateYear = 2021;
    const newDecisionDate = `${newDecisionDateYear}-${newDecisionDateMonth}-${newDecisionDateDay}`;

    it('should call save methods with the correct data', async () => {
      req = {
        body: {
          'decision-date': newDecisionDate,
          'decision-date-day': newDecisionDateDay,
          'decision-date-month': newDecisionDateMonth,
          'decision-date-year': newDecisionDateYear,
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      await postApplicationDecisionDate(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.applicationDecisionDate,
        nextPage: `${appealDetails}/${appealId}`,
        viewData: {
          [hasAppealSubmission.decisionDate]: new Date(`${newDecisionDate}T12:00:00.000Z`),
          decisionDate: {
            day: '20',
            month: '10',
            year: 2021,
          },
        },
        saveData: saveAppealSubmissionData,
      });
    });
  });
});
