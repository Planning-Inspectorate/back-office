const { getAppealDetails } = require('./appeal-details');
const views = require('../config/views');
const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/api-wrapper');
jest.mock('../lib/save-and-continue');

describe('controllers/appeal-details', () => {
  let req;
  let res;
  let currentPage;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
    currentPage = views.appealDetails;
  });

  describe('getReviewQuestionnaire', () => {
    it('should render the view with data correctly', () => {
      const {
        session: { appeal, questionnaire },
      } = req;

      getAppealDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        pageTitle: 'Appeal details',
        backLink: '/appeals-list',
        appealData: {
          ...appeal,
        },
        questionnaireData: questionnaire,
      });
    });
  });
});
