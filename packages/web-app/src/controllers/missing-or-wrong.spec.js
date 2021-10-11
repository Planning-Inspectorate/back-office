const { getMissingOrWrong, postMissingOrWrong } = require('./missing-or-wrong');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { getText } = require('../config/review-appeal-submission');

jest.mock('../lib/save-and-continue');

describe('controllers/missing-or-wrong', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';
  const missingReasons = ['other', 'outOfTime'];
  const missingDocumentReasons = ['noApplicationForm'];
  const outcomeDetails = {
    reasons: missingReasons,
    documentReasons: missingDocumentReasons,
    otherReason: 'other description',
  };
  const expectedViewData = {
    pageTitle: 'What is missing or wrong?',
    backLink: `/${views.reviewAppealSubmission}/${appealId}`,
    getText,
    outcomeDetails,
    appealReference: horizonId,
  };

  let req;
  let res;

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getMissingOrWrong', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: { id: appealId, horizonId },
          casework: { outcomeDetails },
        },
      };

      getMissingOrWrong(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.missingOrWrong, expectedViewData);
    });
  });

  describe('postMissingOrWrong', () => {
    it('should call saveAndContinue with the correct params', () => {
      req = {
        body: {
          'missing-or-wrong-reasons': missingReasons,
          'missing-or-wrong-documents': missingDocumentReasons,
          'other-reason': outcomeDetails.otherReason,
        },
        session: {
          appeal: { id: appealId, horizonId },
          casework: {},
        },
      };

      postMissingOrWrong(req, res);

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.missingOrWrong,
        nextPage: views.checkAndConfirm,
        viewData: expectedViewData,
      });
      expect(req.session.casework.outcomeDetails).toEqual(outcomeDetails);
    });
  });
});
