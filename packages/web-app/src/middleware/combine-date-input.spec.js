const { mockReq, mockRes } = require('../../test/utils/mocks');
const combineDateInputs = require('./combine-date-inputs');

describe('middleware/combine-date-inputs', () => {
  [
    {
      description: 'should return early if `req.body` is not set',
      given: () => {
        const withoutBody = { ...mockReq };
        delete withoutBody.body;
        return withoutBody;
      },
      expected: (req, res, next) => {
        expect(req.body).toBe(undefined);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should return early if no date inputs',
      given: () => ({
        ...mockReq,
        body: {},
      }),
      expected: (req, res, next) => {
        expect(req.body['mock-date']).toBe(undefined);
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should set the correct empty date if fields are empty',
      given: () => ({
        ...mockReq,
        body: {
          'mock-date-day': '',
          'mock-date-month': '',
          'mock-date-year': '',
        },
      }),
      expected: (req, res, next) => {
        expect(req.body['mock-date']).toEqual('-0-0');
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should set the full date if fields are not empty',
      given: () => ({
        ...mockReq,
        body: {
          'mock-date-day': '01',
          'mock-date-month': '01',
          'mock-date-year': '2020',
        },
      }),
      expected: (req, res, next) => {
        expect(req.body['mock-date']).toEqual('2020-01-01');
        expect(next).toHaveBeenCalled();
      },
    },
    {
      description: 'should return multiple dates if multiple date inputs used',
      given: () => ({
        ...mockReq,
        body: {
          'mock-date-day': '01',
          'mock-date-month': '01',
          'mock-date-year': '2020',
          'another-mock-date-day': '02',
          'another-mock-date-month': '02',
          'another-mock-date-year': '2021',
        },
      }),
      expected: (req, res, next) => {
        expect(req.body['mock-date']).toEqual('2020-01-01');
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ description, given, expected }) => {
    it(description, () => {
      const next = jest.fn();
      const req = given();

      combineDateInputs(req, mockRes(), next);

      expected(req, mockRes(), next);
    });
  });
});
