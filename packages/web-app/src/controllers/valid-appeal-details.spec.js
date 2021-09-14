const { getValidAppealDetails, postValidAppealDetails } = require('./valid-appeal-details');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/save-and-continue');

describe('controllers/valid-appeal-details', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';
  const validAppealDetails = 'some appeal details';
  const expectedViewData = {
    pageTitle: 'Valid appeal details',
    backLink: `/${views.reviewAppealSubmission}/${appealId}`,
    validAppealDetails,
    appealReference: horizonId,
  };

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getValidAppealDetails', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appeal: { id: appealId, horizonId },
            casework: { validAppealDetails },
          },
        },
      };

      getValidAppealDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.validAppealDetails, expectedViewData);
    });
  });

  describe('postValidAppealDetails', () => {
    it('should call saveAndContinue with the correct params', () => {
      req = {
        body: {
          'valid-appeal-details': validAppealDetails,
        },
        session: {
          appeal: {
            appeal: { id: appealId, horizonId },
            casework: {},
          },
        },
      };

      postValidAppealDetails(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.validAppealDetails,
        nextPage: views.home,
        viewData: expectedViewData,
      });
      expect(req.session.appeal.casework.validAppealDetails).toEqual(validAppealDetails);
    });
  });
});
