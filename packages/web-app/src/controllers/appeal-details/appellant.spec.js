const { getAppellantDetails, postAppellantDetails } = require('./appellant');
const views = require('../../config/views');
const saveAndContinue = require('../../lib/save-and-continue');
const { mockReq, mockRes } = require('../../../test/utils/mocks');
const { hasAppealSubmission, appealLink } = require('../../config/db-fields');
const { saveAppealLinkData, saveAppealSubmissionData } = require('../../lib/api-wrapper');
const { appealDetails } = require('../../config/views');

jest.mock('../../lib/save-and-continue');
jest.mock('../../lib/api-wrapper');

describe('controllers/appeal-details/appellant', () => {
  let req;
  let res;

  const expectedViewData = {
    pageTitle: 'Change appellant details',
  };

  const appealId = 'ff5fe7af-e69c-4c0e-9d78-70890b2a6e31';
  const appellantName = 'Appellant Name';
  const creatorEmailAddress = 'email.address@example.com';

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getAppellantDetails', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            appellantName,
            creatorEmailAddress,
          },
        },
      };

      getAppellantDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appellant, {
        ...expectedViewData,
        appealData: {
          appellantName,
          creatorEmailAddress,
        },
      });
    });
  });

  describe('postAppellantDetails', () => {
    const newAppellantName = 'New Appellant Name';
    const newCreatorEmailAddress = 'new.email.address@example.com';

    it('should call save methods with the correct data', async () => {
      req = {
        body: {
          'appellant-name': newAppellantName,
          'appellant-email': newCreatorEmailAddress,
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      await postAppellantDetails(req, res);

      expect(saveAppealLinkData).toBeCalledTimes(1);
      expect(saveAppealLinkData).toBeCalledWith({
        appealId,
        [appealLink.appellantName]: newAppellantName,
        [hasAppealSubmission.creatorEmailAddress]: newCreatorEmailAddress,
      });

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.appellant,
        nextPage: `${appealDetails}/${appealId}`,
        viewData: {
          [appealLink.appellantName]: newAppellantName,
          [hasAppealSubmission.creatorEmailAddress]: newCreatorEmailAddress,
        },
        saveData: saveAppealSubmissionData,
      });
    });

    it('should handle errors correctly', async () => {
      req = {
        body: {
          'appellant-name': newAppellantName,
          'appellant-email': newCreatorEmailAddress,
          errors: {
            key: 'value',
          },
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      await postAppellantDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appellant, {
        ...expectedViewData,
        appealData: {
          [appealLink.appellantName]: newAppellantName,
          [hasAppealSubmission.creatorEmailAddress]: newCreatorEmailAddress,
        },
        errorSummary: [],
        errors: {
          key: 'value',
        },
      });
    });

    it('should handle exceptions correctly', async () => {
      req = {
        body: {
          'appellant-name': newAppellantName,
          'appellant-email': newCreatorEmailAddress,
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      saveAppealLinkData.mockImplementation(() => {
        throw new Error('Test Error');
      });

      await postAppellantDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.appellant, {
        ...expectedViewData,
        appealData: {
          [appealLink.appellantName]: newAppellantName,
          [hasAppealSubmission.creatorEmailAddress]: newCreatorEmailAddress,
        },
        errorSummary: [
          {
            href: '#',
            text: 'Error: Test Error',
          },
        ],
        errors: {},
      });
    });
  });
});
