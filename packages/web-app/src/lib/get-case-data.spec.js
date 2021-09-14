const getCaseData = require('./get-case-data');
const { getData } = require('./api-wrapper');
const { mockReq, mockRes, mockNext: next } = require('../../test/utils/mocks');

jest.mock('./api-wrapper', () => ({
  getData: jest.fn(),
}));

describe('lib/getCaseData', () => {
  let req;
  let res;

  const appealId = '5c943cb9-e029-4094-a447-4b3256d6ede7';
  const horizonId = 'APP/Q9999/D/21/1234567';
  const getDataReturnValue = {
    appeal: {
      horizonId,
    },
  };
  const alreadyExistingAppeal = {
    appeal: {
      id: appealId,
      horizonId: 'ThisAppealDataAlreadyExists',
    },
  };

  beforeEach(() => {
    req = mockReq;
    res = mockRes();
  });

  describe('getCaseData', () => {
    it('should set req.session.appeal when req.session.appeal does not exist', () => {
      getData.mockReturnValue(getDataReturnValue);

      req.params = {
        appealId,
      };

      getCaseData(req, res, next);

      expect(getData).toBeCalledTimes(1);
      expect(getData).toBeCalledWith(appealId);
      expect(req.session.appeal).toEqual(getDataReturnValue);
    });

    it('should not set req.session.appeal when req.session does not exist', () => {
      getData.mockReturnValue(getDataReturnValue);

      req = {
        ...req,
        session: undefined,
      };

      getCaseData(req, res, next);

      expect(getData).not.toBeCalled();
      expect(req.session).toBeUndefined();
    });

    it('should not set req.session.appeal when req.session.appeal exists', () => {
      getData.mockReturnValue(getDataReturnValue);

      req = {
        ...req,
        params: {
          appealId,
        },
        session: {
          appeal: alreadyExistingAppeal,
        },
      };

      getCaseData(req, res, next);

      expect(getData).not.toBeCalled();
      expect(req.session.appeal).toEqual(alreadyExistingAppeal);
    });

    it('should delete req.session when the given appeal id does not equal the session appeal id', () => {
      getData.mockReturnValue(getDataReturnValue);

      const differentAppealId = '0127d52e-ed17-4e14-8d68-f6ffa872f846';

      req = {
        ...req,
        params: {
          appealId: differentAppealId,
        },
        session: {
          appeal: alreadyExistingAppeal,
        },
      };

      getCaseData(req, res, next);

      expect(req.log.debug).toBeCalledTimes(2);
      expect(req.log.debug).toBeCalledWith({ id: differentAppealId }, 'Deleting session data');
      expect(req.log.debug).toBeCalledWith({ id: differentAppealId }, 'Getting existing data');
      expect(req.session.appeal).toEqual(getDataReturnValue);
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
