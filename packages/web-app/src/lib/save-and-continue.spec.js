const saveAndContinue = require('./save-and-continue');
const { saveData } = require('./api-wrapper');
const { mockReq, mockRes } = require('../../test/utils/controller-mocks');

jest.mock('./api-wrapper', () => ({
  saveData: jest.fn(),
}));

describe('lib/saveAndContinue', () => {
  const caseReference = '1234567';
  const appealId = '60cfdd57-1739-488d-a416-64f3240e4ca1';
  const casework = {
    reviewOutcome: 'valid',
  };
  const saveDataReturnValue = {
    appeal: {
      caseReference,
    },
  };
  const res = mockRes();
  const currentPage = 'validAppealDescription';
  const nextPage = 'home';
  const viewData = {};

  let req;

  beforeEach(() => {
    req = { ...mockReq() };
  });

  describe('saveAndContinue', () => {
    it('should set the correct data and redirect to the next page', () => {
      saveData.mockReturnValue(saveDataReturnValue);

      req.session = {
        appeal: {
          appealId,
        },
        casework,
      };

      saveAndContinue({ req, res, currentPage, nextPage, viewData });

      expect(res.cookie).toBeCalledTimes(2);
      expect(res.cookie).toBeCalledWith('appealId', appealId);
      expect(res.cookie).toBeCalledWith(appealId, JSON.stringify(casework));
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(`/${nextPage}`);
    });

    it('should render the current page with the correct data when a field fails validation', () => {
      saveData.mockReturnValue(saveDataReturnValue);

      const errors = {
        'review-outcome': 'Must be selected',
      };
      const errorSummary = [{ text: 'Must be selected', href: '#' }];

      req.body = {
        errors,
        errorSummary,
      };

      saveAndContinue({ req, res, currentPage, nextPage, viewData });

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        ...viewData,
        errors,
        errorSummary,
      });
      expect(res.redirect).not.toBeCalled();
    });

    it('should render the current page with the correct data when an error is thrown', () => {
      saveData.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      saveAndContinue({ req, res, currentPage, nextPage, viewData });

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(currentPage, {
        ...viewData,
        errors: {},
        errorSummary: [{ text: 'Error: Internal Server Error', href: '#' }],
      });
      expect(res.redirect).not.toBeCalled();
    });
  });
});
