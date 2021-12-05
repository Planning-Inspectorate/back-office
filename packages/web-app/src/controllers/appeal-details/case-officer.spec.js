const { getCaseOfficerDetails, postCaseOfficerDetails } = require('./case-officer');
const views = require('../../config/views');
const saveAndContinue = require('../../lib/save-and-continue');
const { mockReq, mockRes } = require('../../../test/utils/mocks');
const { hasAppeal } = require('../../config/db-fields');
const { saveAppealData } = require('../../lib/api-wrapper');
const { appealDetails } = require('../../config/views');

jest.mock('../../lib/save-and-continue');
jest.mock('../../lib/api-wrapper');

describe('controllers/appeal-details/case-details', () => {
  let req;
  let res;

  const expectedViewData = {
    pageTitle: 'Change agent details',
  };

  const appealId = 'ff5fe7af-e69c-4c0e-9d78-70890b2a6e31';
  const caseOfficerFirstName = 'Appellant Name';
  const caseOfficerEmail = 'email.address@example.com';

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
    jest.clearAllMocks();
  });

  describe('getCaseOfficerDetails', () => {
    it('should render the view with data correctly', () => {
      req = {
        session: {
          appeal: {
            caseOfficerFirstName,
            caseOfficerEmail,
          },
        },
      };

      getCaseOfficerDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.caseOfficer, {
        ...expectedViewData,
        appealData: {
          caseOfficerFirstName,
          caseOfficerEmail,
        },
      });
    });
  });

  describe('postCaseOfficerDetails', () => {
    const newAppellantName = 'New Appellant Name';
    const newCreatorEmailAddress = 'new.email.address@example.com';

    it('should call save methods with the correct data', async () => {
      req = {
        body: {
          'case-officer-name': newAppellantName,
          'case-officer-email': newCreatorEmailAddress,
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      await postCaseOfficerDetails(req, res);

      expect(saveAppealData).toBeCalledTimes(1);
      expect(saveAppealData).toBeCalledWith({
        appealId,
        [hasAppeal.caseOfficerFirstName]: newAppellantName,
        [hasAppeal.caseOfficerEmail]: newCreatorEmailAddress,
      });

      expect(saveAndContinue).toBeCalledTimes(1);
      expect(saveAndContinue).toBeCalledWith({
        req,
        res,
        currentPage: views.caseOfficer,
        nextPage: `${appealDetails}/${appealId}`,
        viewData: {
          [hasAppeal.caseOfficerFirstName]: newAppellantName,
          [hasAppeal.caseOfficerEmail]: newCreatorEmailAddress,
        },
        saveData: saveAppealData,
      });
    });

    it('should handle errors correctly', async () => {
      req = {
        body: {
          'case-officer-name': newAppellantName,
          'case-officer-email': newCreatorEmailAddress,
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

      await postCaseOfficerDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.caseOfficer, {
        ...expectedViewData,
        appealData: {
          [hasAppeal.caseOfficerFirstName]: newAppellantName,
          [hasAppeal.caseOfficerEmail]: newCreatorEmailAddress,
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
          'case-officer-name': newAppellantName,
          'case-officer-email': newCreatorEmailAddress,
        },
        session: {
          appeal: {
            appealId,
          },
        },
      };

      saveAppealData.mockImplementation(() => {
        throw new Error('Test Error');
      });

      await postCaseOfficerDetails(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.caseOfficer, {
        ...expectedViewData,
        appealData: {
          [hasAppeal.caseOfficerFirstName]: newAppellantName,
          [hasAppeal.caseOfficerEmail]: newCreatorEmailAddress,
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
