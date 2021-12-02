const { validationResult } = require('express-validator');
const dateInputValidation = require('./date-input');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/custom/date-input', () => {
  const mockId = 'mock-date';
  const mockLabel = 'the mock date';

  describe('rules', () => {
    it(`has a rule to check for empty day input`, () => {
      const rule = dateInputValidation(mockId, mockLabel)[0].builder.build();

      expect(rule.fields).toEqual(['mock-date-day']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
    });

    it(`has a rule to check for empty month input`, () => {
      const rule = dateInputValidation(mockId, mockLabel)[1].builder.build();

      expect(rule.fields).toEqual(['mock-date-month']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
    });

    it(`has a rule for check for empty year input`, () => {
      const rule = dateInputValidation(mockId, mockLabel)[2].builder.build();

      expect(rule.fields).toEqual(['mock-date-year']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
    });

    it(`has a rule to check for valid day input`, () => {
      const rule = dateInputValidation(mockId, mockLabel)[3].builder.build();

      expect(rule.fields).toEqual(['mock-date-day']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].options).toEqual([{ min: 1, max: 31 }]);
      expect(rule.stack[0].negated).toBeFalsy();
      expect(rule.stack[3].negated).toBeFalsy();
    });

    it(`has a rule to check for valid month input`, () => {
      const rule = dateInputValidation(mockId, mockLabel)[4].builder.build();

      expect(rule.fields).toEqual(['mock-date-month']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].options).toEqual([{ min: 1, max: 12 }]);
      expect(rule.stack[0].negated).toBeFalsy();
    });

    it(`has a rule for valid year input`, () => {
      const rule = dateInputValidation(mockId, mockLabel)[5].builder.build();

      expect(rule.fields).toEqual(['mock-date-year']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].options).toEqual([{ min: 1000, max: 9999 }]);
      expect(rule.stack[0].negated).toBeFalsy();
    });
  });

  describe('validator', () => {
    [
      {
        title: 'invalid (all empty) - fail',
        given: () => ({
          body: {
            'mock-date-day': '',
            'mock-date-month': '',
            'mock-date-year': '',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Enter the mock date');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (empty day, month) - fail',
        given: () => ({
          body: {
            'mock-date-day': '',
            'mock-date-month': '',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must include a day and month');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (empty day, year) - fail',
        given: () => ({
          body: {
            'mock-date-day': '',
            'mock-date-month': '12',
            'mock-date-year': '',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must include a day and year');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (empty day) - fail',
        given: () => ({
          body: {
            'mock-date-day': '',
            'mock-date-month': '12',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must include a day');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (empty month, year) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '',
            'mock-date-year': '',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must include a month and year');
          expect(result.errors[0].param).toEqual('mock-date-month');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (empty month) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must include a month');
          expect(result.errors[0].param).toEqual('mock-date-month');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (empty year) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '12',
            'mock-date-year': '',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must include a year');
          expect(result.errors[0].param).toEqual('mock-date-year');
          expect(result.errors[0].value).toEqual('');
        },
      },
      {
        title: 'invalid (day not integer) - fail',
        given: () => ({
          body: {
            'mock-date-day': 'mock',
            'mock-date-month': '12',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual('mock');
        },
      },
      {
        title: 'invalid (day > 31) - fail',
        given: () => ({
          body: {
            'mock-date-day': '45',
            'mock-date-month': '12',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual('45');
        },
      },
      {
        title: 'invalid (31 day in 30 day month) - fail',
        given: () => ({
          body: {
            'mock-date-day': '31',
            'mock-date-month': '6',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual(31);
        },
      },
      {
        title: 'invalid (29 days in February when not leap year) - fail',
        given: () => ({
          body: {
            'mock-date-day': '29',
            'mock-date-month': '2',
            'mock-date-year': '2019',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-day');
          expect(result.errors[0].value).toEqual(29);
        },
      },
      {
        title: 'invalid (month not numeric) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': 'mock',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-month');
          expect(result.errors[0].value).toEqual('mock');
        },
      },
      {
        title: 'invalid (impossible number months) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '22',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-month');
          expect(result.errors[0].value).toEqual('22');
        },
      },
      {
        title: 'invalid (year not numeric) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '12',
            'mock-date-year': 'mock',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-year');
          expect(result.errors[0].value).toEqual('mock');
        },
      },
      {
        title: 'invalid (year outside range) - fail',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '12',
            'mock-date-year': '10',
          },
        }),
        expected: (result) => {
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('The mock date must be a real date');
          expect(result.errors[0].param).toEqual('mock-date-year');
          expect(result.errors[0].value).toEqual('10');
        },
      },
      {
        title: 'valid date (29 days in leap year) - pass',
        given: () => ({
          body: {
            'mock-date-day': '29',
            'mock-date-month': '2',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid date - pass',
        given: () => ({
          body: {
            'mock-date-day': '1',
            'mock-date-month': '12',
            'mock-date-year': '2020',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(
          mockReq,
          mockRes,
          dateInputValidation(mockId, mockLabel)
        );
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
