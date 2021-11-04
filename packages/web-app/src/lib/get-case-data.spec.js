const getCaseData = require('./get-case-data');
const { getData } = require('./api-wrapper');
const { mockReq, mockRes } = require('../../test/utils/controller-mocks');

jest.mock('./api-wrapper', () => ({
  getData: jest.fn(),
}));

describe('lib/getCaseData', () => {
  const next = jest.fn();

  let req;
  let res;
  let getDataReturnValue;

  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';
  const alreadyExistingAppeal = {
    appeal: {
      id: appealId,
      horizonId: 'ThisAppealDataAlreadyExists',
    },
  };

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    getDataReturnValue = {
      ...{
        appeal: {
          horizonId,
        },
        casework: {},
        questionnaire: {},
      },
    };
  });

  describe('getCaseData', () => {
    it('should set req.session with appeal data, default casework and questionnaire data', () => {
      getDataReturnValue = {
        casework: {
          reviewer: {
            name: 'Sally Smith',
          },
          reviewOutcome: 'valid',
        },
        questionnaire: {
          horizonId: 'fake-horizon-id',
        },
      };

      getData.mockReturnValue(getDataReturnValue);

      req.params = {
        appealId,
      };

      getCaseData(req, res, next);

      expect(getData).toBeCalledTimes(1);
      expect(getData).toBeCalledWith(appealId);
      expect(req.session).toEqual(getDataReturnValue);
    });

    it('should set req.session with appeal data, casework data and questionnaire data', () => {
      getDataReturnValue.casework = {
        reviewer: {
          name: 'William Jones',
        },
        reviewOutcome: 'incomplete',
      };

      getData.mockReturnValue(getDataReturnValue);

      req = {
        ...req,
        params: {
          appealId,
        },
        cookies: {
          [appealId]: JSON.stringify({
            reviewOutcome: 'valid',
          }),
          appeal_questionnaire: JSON.stringify({ outcome: 'COMPLETE' }),
        },
      };

      getCaseData(req, res, next);

      expect(getData).toBeCalledTimes(1);
      expect(getData).toBeCalledWith(appealId);
      expect(req.session).toEqual(getDataReturnValue);
    });

    it('should clear the cookies when the given appeal id exists and it does not equal the session appeal id', () => {
      getData.mockReturnValue(getDataReturnValue);

      const differentAppealId = '0127d52e-ed17-4e14-8d68-f6ffa872f846';

      req = {
        ...req,
        params: {
          appealId: differentAppealId,
        },
        cookies: [
          {
            appealId: alreadyExistingAppeal.appeal.id,
          },
          {
            appealId_questionnaire: `${alreadyExistingAppeal.appeal.id}_questionnaire`,
          },
        ],
      };

      getCaseData(req, res, next);

      expect(res.clearCookie).toBeCalledTimes(3);
      expect(res.clearCookie).toBeCalledWith('appealId');
      expect(res.clearCookie).toBeCalledWith('appeal_questionnaire');
    });

    it('should not clear the cookies when the given appeal id does not exist and it does not equal the session appeal id', () => {
      getData.mockReturnValue(getDataReturnValue);

      const differentAppealId = undefined;

      req = {
        ...req,
        params: {
          appealId: differentAppealId,
        },
        cookies: {
          appealId: alreadyExistingAppeal,
        },
      };

      getCaseData(req, res, next);

      expect(res.clearCookie).not.toBeCalled();
    });

    it('should throw the error when an error occurs', async () => {
      getData.mockImplementation(() => {
        throw new Error('Internal Server Error');
      });

      req.session = {};

      try {
        await getCaseData(req, res, next);
        throw new Error('Expected error not thrown');
      } catch (err) {
        expect(err.message).toEqual('Internal Server Error');
      }
    });
  });
});
