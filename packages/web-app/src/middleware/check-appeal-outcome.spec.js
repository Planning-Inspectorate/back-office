const { mockReq, mockRes } = require('../../test/utils/controller-mocks');
const checkAppealOutcome = require('./check-appeal-outcome');

describe('middleware/check-appeal-outcome', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  [
    {
      title: 'Return 404 if there is no appeal id in the params',
      req: { ...mockReq, params: {} },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(404);
      },
    },
    {
      title: 'Return next if there is appeal id in the params',
      req: {
        ...mockReq,
        session: {},
        params: {
          appealId: 12345,
        },
      },
      expected: (req, res, next) => {
        expect(next).toBeCalledTimes(1);
      },
    },
  ].forEach(({ title, req, expected }) => {
    test(title, () => {
      const next = jest.fn();
      const res = mockRes();

      checkAppealOutcome(req, res, next);
      expected(req, res, next);
    });
  });
});
