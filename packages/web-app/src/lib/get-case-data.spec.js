const getCaseData = require('./get-case-data');
const { getAppealData, getAllAppeals } = require('./api-wrapper');
const { mockReq, mockRes } = require('../../test/utils/controller-mocks');

const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';

jest.mock('./api-wrapper');

describe('lib/getCaseData', () => {
  const next = jest.fn();

  let req;
  let res;
  let getDataReturnValue;

  const alreadyExistingAppeal = {
    appeal: {
      id: appealId,
    },
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    getDataReturnValue = {
      ...{
        appeal: {
          appealId,
        },
        casework: {},
      },
    };
  });

  describe('getCaseData', () => {
    it('should set req.session with appeal data and default casework data', async () => {
      getDataReturnValue = {
        ...{
          appeal: {
            appealId,
          },
          casework: {},
        },
      };

      getAppealData.mockReturnValue(getDataReturnValue);

      req.params = {
        appealId,
      };

      await getCaseData(req, res, next);

      expect(getAppealData).toBeCalledTimes(1);
      expect(getAppealData).toBeCalledWith(appealId);
      expect(req.session).toEqual(getDataReturnValue);
    });

    it('should set req.session with appeal data and casework data', async () => {
      getAllAppeals.mockReturnValue(getDataReturnValue);

      req = {
        ...req,
        params: {
          appealId,
        },
        cookies: {
          [appealId]: JSON.stringify({
            reviewOutcome: 1,
          }),
        },
      };

      await getCaseData(req, res, next);

      expect(getAppealData).toBeCalledTimes(1);
      expect(getAppealData).toBeCalledWith(appealId);
      expect(req.session).toEqual({
        ...getDataReturnValue,
        casework: {
          reviewOutcome: 1,
        },
      });
    });

    it('should clear the cookies when the given appeal id exists and it does not equal the session appeal id', async () => {
      const differentAppealId = '0127d52e-ed17-4e14-8d68-f6ffa872f846';

      getDataReturnValue = {
        ...{
          appeal: {
            appealId,
          },
          casework: {},
        },
      };

      getAppealData.mockReturnValue(getDataReturnValue);

      req = {
        ...req,
        params: {
          appealId: differentAppealId,
        },
        cookies: {
          appealId: alreadyExistingAppeal.id,
        },
      };

      await getCaseData(req, res, next);

      expect(res.clearCookie).toBeCalledTimes(2);
      expect(res.clearCookie).toBeCalledWith('appealId');
      expect(res.clearCookie).toBeCalledWith(alreadyExistingAppeal.id);
    });

    it('should not clear the cookies when the given appeal id does not exist and it does not equal the session appeal id', async () => {
      getDataReturnValue = {
        ...{
          appeal: {
            appealId,
          },
          casework: {},
        },
      };

      getAppealData.mockReturnValue(getDataReturnValue);

      req = {
        ...req,
        params: {
          appealId: undefined,
        },
        cookies: {
          appealId: alreadyExistingAppeal,
        },
      };

      await getCaseData(req, res, next);

      expect(res.clearCookie).not.toBeCalled();
    });

    it('should throw an error when an error occurs', () => {
      getAppealData.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      expect(() => getCaseData(req, res, next)).rejects.toThrow(
        'Failed to get existing data - Internal Server Error'
      );
    });
  });
});
