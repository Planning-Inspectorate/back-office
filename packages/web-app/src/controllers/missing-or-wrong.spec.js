const { getMissingOrWrong, postMissingOrWrong } = require('./missing-or-wrong');
const views = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { mockReq, mockRes } = require('../../test/utils/mocks');
const { getText } = require('../config/review-appeal-submission');
const { saveAppealData } = require('../lib/api-wrapper');
const { hasAppeal } = require('../config/db-fields');

jest.mock('../lib/save-and-continue');

describe('controllers/missing-or-wrong', () => {
  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const caseReference = '1234567';
  const missingReasons = ['other', 'outOfTime'];
  const missingDocumentReasons = ['noApplicationForm'];
  const otherReason = 'other description';
  const expectedViewData = {
    pageTitle: 'What is missing or wrong?',
    backLink: `/${views.reviewAppealSubmission}/${appealId}`,
    getText,
    missingOrWrong: {
      reasons: [...missingReasons, ...missingDocumentReasons],
      otherReason,
    },
    appealReference: caseReference,
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
          appeal: { appealId, caseReference },
          casework: {
            [hasAppeal.invalidAppealReasons]: [...missingReasons, ...missingDocumentReasons],
            [hasAppeal.invalidReasonOther]: otherReason,
          },
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
          'other-reason': otherReason,
        },
        session: {
          appeal: { appealId, caseReference },
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
        saveData: saveAppealData,
      });
      expect(req.session.casework[hasAppeal.invalidAppealReasons]).toEqual(
        JSON.stringify([...missingReasons, ...missingDocumentReasons])
      );
      expect(req.session.casework[hasAppeal.invalidReasonOther]).toEqual(otherReason);
    });
  });
});
