const { getValidAppealDetails, postValidAppealDetails } = require('./valid-appeal-details');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');

jest.mock('../lib/save-and-continue');

describe('controllers/valid-appeal-details', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const caseReference = '1234567';
  const valid = {
    description: 'some appeal details',
  };
  const expectedViewData = {
    pageTitle: 'Valid appeal details',
    backLink: `/${views.reviewAppealSubmission}/${appealId}`,
    valid,
    appealReference: caseReference,
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
          appeal: { id: appealId, caseReference },
          casework: {
            outcomeDetails: {
              valid,
            },
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
          'valid-appeal-details': valid.description,
        },
        session: {
          appeal: { id: appealId, caseReference },
          casework: {},
        },
      };

      postValidAppealDetails(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.validAppealDetails,
        nextPage: views.checkAndConfirm,
        viewData: expectedViewData,
      });
      expect(req.session.casework.outcomeDetails.valid).toEqual(valid);
    });
  });
});
