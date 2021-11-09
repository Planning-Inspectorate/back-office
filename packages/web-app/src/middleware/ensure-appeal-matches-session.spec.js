const { mockReq, mockRes } = require('../../test/utils/controller-mocks');
const ensureAppealMatchesSession = require('./ensure-appeal-matches-session');

describe('middleware/ensure-appeal-matches-session', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'Return 401 if there is no appeal id in the session',
      req: {},
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      },
    },
    {
      title: 'Return 401 if req.params.appealId is not provided',
      req: {
        ...mockReq,
        params: {},
      },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      },
    },
    {
      title: 'Return 401 if req.params.appealId is explicitly undefined',
      req: {
        ...mockReq,
        params: {
          appealId: undefined,
        },
      },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      },
    },
    {
      title: 'Return 403 if req.params.appealId !== req.session.appeal.id',
      req: {
        session: {
          appeal: {
            appeal: {
              id: 'abc-123',
            },
          },
        },
        params: {
          appealId: '789-xyz',
        },
      },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(401);
      },
    },
    {
      title: 'Call next() if req.params.appealId === req.session.appeal.id',
      req: {
        session: {
          appeal: {
            appealId: 'abc-123',
          },
        },
        params: {
          appealId: 'abc-123',
        },
      },
      expected: (req, res, next) => {
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ title, req, expected }) => {
    test(title, () => {
      const next = jest.fn();
      const res = mockRes();

      ensureAppealMatchesSession(req, res, next);

      expected(req, res, next);
    });
  });
});
