const { getInvalidAppealDetails, postInvalidAppealDetails } = require('./invalid-appeal-details');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { getText } = require('../config/review-appeal-submission');

jest.mock('../lib/save-and-continue');

describe('controllers/invalid-appeal-details', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const caseReference = '1234567';
  const invalid = {
    reasons: ['other', 'outOfTime'],
    otherReason: 'other description',
  };
  const expectedViewData = {
    pageTitle: 'Invalid appeal details',
    backLink: `/${views.reviewAppealSubmission}/${appealId}`,
    getText,
    invalid,
    appealReference: caseReference,
  };

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getInvalidAppealDetails', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: { id: appealId, caseReference },
          casework: {
            outcomeDetails: {
              invalid,
            },
          },
        },
      };

      getInvalidAppealDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.invalidAppealDetails, expectedViewData);
    });
  });

  describe('postInvalidAppealDetails', () => {
    it('should call saveAndContinue with the correct params', () => {
      req = {
        body: {
          'invalid-appeal-reasons': invalid.reasons,
          'other-reason': invalid.otherReason,
        },
        session: {
          appeal: { id: appealId, caseReference },
          casework: {},
        },
      };

      postInvalidAppealDetails(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.invalidAppealDetails,
        nextPage: views.checkAndConfirm,
        viewData: expectedViewData,
      });
      expect(req.session.casework.outcomeDetails.invalid).toEqual(invalid);
    });
  });
});
