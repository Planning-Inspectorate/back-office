const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('./appellant-details');

describe('validators/your-details', () => {
  describe('rules', () => {
    it(`has a rule for the appellant's name`, () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['appellant-name']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(5);

      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
      expect(rule.stack[0].message).toEqual('Enter your name');

      expect(rule.stack[2].validator.name).toEqual('matches');
      expect(rule.stack[2].options[0]).toEqual(/^[a-z\-' ]+$/i);
      expect(rule.stack[2].message).toEqual(
        'Name must only include letters a to z, hyphens, spaces and apostrophes'
      );

      expect(rule.stack[4].validator.name).toEqual('isLength');
      expect(rule.stack[4].options).toEqual([{ min: 2, max: 80 }]);
    });

    it(`has a rule for the appellant's email`, () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['appellant-email']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack).toHaveLength(7);
      expect(rule.stack[0].message).toEqual('Enter your email address');
      expect(rule.stack[2].validator.name).toEqual('isEmail');
    });

    it('should have an array of rules', () => {
      expect(rules().length).toEqual(2);
      expect(rules()[0].builder.fields[0]).toEqual('appellant-name');
      expect(rules()[1].builder.fields[0]).toEqual('appellant-email');
    });
  });

  describe('validator', () => {
    [
      {
        title: 'undefined - empty',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Enter your name');
          expect(result.errors[0].param).toEqual('appellant-name');
          expect(result.errors[0].value).toEqual(undefined);
          expect(result.errors[1].location).toEqual('body');
          expect(result.errors[1].msg).toEqual('Enter your email address');
          expect(result.errors[1].param).toEqual('appellant-email');
          expect(result.errors[1].value).toEqual(undefined);
        },
      },
      {
        title: 'invalid values 1 - fail',
        given: () => ({
          body: {
            'appellant-name': '12 abc',
            'appellant-email': '@.com',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Name must only include letters a to z, hyphens, spaces and apostrophes'
          );
          expect(result.errors[0].param).toEqual('appellant-name');
          expect(result.errors[0].value).toEqual('12 abc');

          expect(result.errors[1].location).toEqual('body');
          expect(result.errors[1].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[1].param).toEqual('appellant-email');
          expect(result.errors[1].value).toEqual('@.com');
        },
      },
      {
        title: 'invalid values 2 - fail - name too short and invalid email',
        given: () => ({
          body: {
            'appellant-name': 'a',
            'appellant-email': 13,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Name must be between 2 and 80 characters');
          expect(result.errors[0].param).toEqual('appellant-name');
          expect(result.errors[0].value).toEqual('a');

          expect(result.errors[1].location).toEqual('body');
          expect(result.errors[1].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[1].param).toEqual('appellant-email');
          expect(result.errors[1].value).toEqual(13);
        },
      },
      {
        title: 'invalid values 2 - fail - name too long and invalid email',
        given: () => ({
          body: {
            'appellant-name':
              'Invalid name because it is eighty-one characters long--abcdefghijklmnopqrstuvwxyz',
            'appellant-email': 13,
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual('Name must be between 2 and 80 characters');
          expect(result.errors[0].param).toEqual('appellant-name');
          expect(result.errors[0].value).toEqual(
            'Invalid name because it is eighty-one characters long--abcdefghijklmnopqrstuvwxyz'
          );

          expect(result.errors[1].location).toEqual('body');
          expect(result.errors[1].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[1].param).toEqual('appellant-email');
          expect(result.errors[1].value).toEqual(13);
        },
      },
      {
        title: 'invalid email - fail 1',
        given: () => ({
          body: {
            'appellant-name': "timmy o'tester-jones",
            'appellant-email': 'thomas-@example.com',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[0].param).toEqual('appellant-email');
          expect(result.errors[0].value).toEqual('thomas-@example.com');
        },
      },
      {
        title: 'invalid email - fail 2',
        given: () => ({
          body: {
            'appellant-name': "timmy o'tester-jones",
            'appellant-email': 'thomas@example.c',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].location).toEqual('body');
          expect(result.errors[0].msg).toEqual(
            'Enter an email address in the correct format, like name@example.com'
          );
          expect(result.errors[0].param).toEqual('appellant-email');
          expect(result.errors[0].value).toEqual('thomas@example.c');
        },
      },
      {
        title: 'valid values - pass',
        given: () => ({
          body: {
            'appellant-name': "timmy o'tester-jones",
            'appellant-email': 'timmy@example.com',
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

        await testExpressValidatorMiddleware(mockReq, mockRes, rules());
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
