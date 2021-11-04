const { mockReq, mockRes } = require('../../test/utils/controller-mocks');
const checkAppealOutcome = require('./check-appeal-outcome');

describe('middleware/check-appeal-outcome', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  [
    {
      title: 'Return 404 if there is no appeal id in the params',
      req: { ...mockReq, session: { appeal: {} } },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(404);
      },
    },
    {
      title: 'Return next if there is appeal id in the params',
      req: {
        ...mockReq,
        session: { appeal: { id: 'b1a04ba7-9604-4196-b6b4-b16b4acd1875' } },
      },
      expected: (req, res, next) => {
        expect(next).toBeCalledTimes(1);
      },
    },
    {
      title: 'Return next if the review outcome is complete',
      req: {
        ...mockReq,
        session: { appeal: { id: 'b1a04ba7-9604-4196-b6b4-b16b4acd1875' }, outcome: 'COMPLETE' },
      },
      expected: (req, res, next) => {
        expect(next).toBeCalledTimes(1);
      },
    },
    {
      title: 'Return next if the review outcome is incomplete',
      req: {
        ...mockReq,
        session: { appeal: { id: 'b1a04ba7-9604-4196-b6b4-b16b4acd1875' }, outcome: 'INCOMPLETE' },
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
