jest.mock('../custom/date-input', () => jest.fn());

const { validationResult } = require('express-validator');
const { rules } = require('./decision-date');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/eligibility/decision-date', () => {
  describe('rules', () => {
    it(`has a rule for days in the future`, () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['decision-date']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].negated).toBeFalsy();
    });
  });

  describe('validator', () => {
    [
      {
        title: 'invalid (in future) - fail',
        given: () => ({
          body: {
            'decision-date': '2130-06-11',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Decision date must be today or in the past');
          expect(result.errors[0].param).toEqual('decision-date');
          expect(result.errors[0].value).toEqual('2130-06-11');
        },
      },
      {
        title: 'valid date - pass',
        given: () => {
          const now = new Date();
          return {
            body: {
              'decision-date': `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
            },
          };
        },
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(mockReq, mockRes, rules());
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
