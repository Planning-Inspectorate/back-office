const { validationResult } = require('express-validator');
const { rules: siteLocationRules } = require('./site-location');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validation/appeal-details/site-location', () => {
  describe('rules', () => {
    let rules;

    beforeEach(() => {
      rules = siteLocationRules();
    });

    it('should have the expected number of rules', () => {
      expect(rules.length).toEqual(5);
    });

    describe('ruleAddressLine1', () => {
      it('is configured with the expected rules', () => {
        const rule = rules[0].builder.build();

        expect(rule.fields).toEqual(['site-address-line-one']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(5);

        expect(rule.stack[0].sanitizer.name).toEqual('escape');

        expect(rule.stack[1].negated).toBeTruthy();
        expect(rule.stack[1].validator.name).toEqual('isEmpty');
        expect(rule.stack[1].message).toEqual('Enter the first line of the address');

        expect(rule.stack[3].negated).toBeFalsy();
        expect(rule.stack[3].validator.name).toEqual('isLength');
        expect(rule.stack[3].options).toEqual([{ max: 60, min: 1 }]);
        expect(rule.stack[3].message).toEqual(
          'The first line of the address must be 60 characters or fewer'
        );
      });
    });

    describe('ruleAddressLine2', () => {
      it('is configured with the expected rules', () => {
        const rule = rules[1].builder.build();

        expect(rule.fields).toEqual(['site-address-line-two']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(3);

        expect(rule.stack[0].sanitizer.name).toEqual('escape');

        expect(rule.stack[1].negated).toBeFalsy();
        expect(rule.stack[1].validator.name).toEqual('isLength');
        expect(rule.stack[1].options).toEqual([{ max: 60, min: 0 }]);
        expect(rule.stack[1].message).toEqual(
          'The second line of the address must be 60 characters or fewer'
        );
      });
    });

    describe('ruleAddressTownCity', () => {
      it('is configured with the expected rules', () => {
        const rule = rules[2].builder.build();

        expect(rule.fields).toEqual(['site-town-city']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(3);

        expect(rule.stack[0].sanitizer.name).toEqual('escape');

        expect(rule.stack[1].negated).toBeFalsy();
        expect(rule.stack[1].validator.name).toEqual('isLength');
        expect(rule.stack[1].options).toEqual([{ max: 60, min: 0 }]);
        expect(rule.stack[1].message).toEqual('Town or City must be 60 characters or fewer');
      });
    });

    describe('ruleAddressCounty', () => {
      it('is configured with the expected rules', () => {
        const rule = rules[3].builder.build();

        expect(rule.fields).toEqual(['site-county']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(3);

        expect(rule.stack[0].sanitizer.name).toEqual('escape');

        expect(rule.stack[1].negated).toBeFalsy();
        expect(rule.stack[1].validator.name).toEqual('isLength');
        expect(rule.stack[1].options).toEqual([{ max: 60, min: 0 }]);
        expect(rule.stack[1].message).toEqual('County must be 60 characters or fewer');
      });
    });

    describe('ruleAddressPostCode', () => {
      it('is configured with the expected rules', () => {
        const rule = rules[4].builder.build();

        expect(rule.fields).toEqual(['site-postcode']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(7);

        expect(rule.stack[0].sanitizer.name).toEqual('escape');

        expect(rule.stack[1].negated).toBeTruthy();
        expect(rule.stack[1].validator.name).toEqual('isEmpty');
        expect(rule.stack[1].message).toEqual('Enter a real postcode');

        expect(rule.stack[3].negated).toBeFalsy();
        expect(rule.stack[3].validator.name).toEqual('isLength');
        expect(rule.stack[3].options).toEqual([{ max: 8, min: 1 }]);
        expect(rule.stack[3].message).toEqual('Postcode must be 8 characters or fewer');
      });
    });
  });

  describe('validator', () => {
    [
      {
        title: 'valid - full address provided',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid - minimum address provided',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid - address line 2 is missing',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid - town / city is missing',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'valid - county is missing',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(0);
        },
      },
      {
        title: 'invalid - site-address-line-one is missing',
        given: () => ({
          body: {
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter the first line of the address');
        },
      },
      {
        title: 'invalid - site-postcode is missing',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter a real postcode');
        },
      },
      {
        title: 'invalid - site-address-line-one (required) and site-county (optional) are missing',
        given: () => ({
          body: {
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter the first line of the address');
        },
      },
      {
        title: 'invalid - site-address-line-one and site-postcode are missing',
        given: () => ({
          body: {
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0].msg).toEqual('Enter the first line of the address');
          expect(result.errors[1].msg).toEqual('Enter a real postcode');
        },
      },
      {
        title: 'invalid - site-county (optional) and site-postcode (required) are missing',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter a real postcode');
        },
      },
      {
        title: 'invalid - all fields are missing',
        given: () => ({
          body: {},
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(2);
          expect(result.errors[0].msg).toEqual('Enter the first line of the address');
          expect(result.errors[1].msg).toEqual('Enter a real postcode');
        },
      },
      {
        title: 'invalid - site-address-line-one is too long',
        given: () => ({
          body: {
            'site-address-line-one': 'a'.repeat(61),
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'The first line of the address must be 60 characters or fewer'
          );
        },
      },
      {
        title: 'invalid - site-address-line-two is too long',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'a'.repeat(61),
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual(
            'The second line of the address must be 60 characters or fewer'
          );
        },
      },
      {
        title: 'invalid - site-town-city is too long',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'a'.repeat(61),
            'site-county': 'South Glos',
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Town or City must be 60 characters or fewer');
        },
      },
      {
        title: 'invalid - site-county is too long',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'a'.repeat(61),
            'site-postcode': 'BS8 1TG',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('County must be 60 characters or fewer');
        },
      },
      {
        title: 'invalid - site-postcode is too long',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'a'.repeat(9),
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Postcode must be 8 characters or fewer');
        },
      },
      {
        title: 'invalid - site-postcode should begin with a letter',
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': '111aaa',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter a real postcode');
        },
      },
      {
        title: "invalid - site-postcode can't be only letters",
        given: () => ({
          body: {
            'site-address-line-one': '1 Taylor Road',
            'site-address-line-two': 'Clifton',
            'site-town-city': 'Bristol',
            'site-county': 'South Glos',
            'site-postcode': 'aaaaaaa',
          },
        }),
        expected: (result) => {
          expect(result.errors).toHaveLength(1);
          expect(result.errors[0].msg).toEqual('Enter a real postcode');
        },
      },
    ].forEach(({ title, given, expected }) => {
      it(`should return the expected validation outcome - ${title}`, async () => {
        const mockReq = given();
        const mockRes = jest.fn();

        await testExpressValidatorMiddleware(mockReq, mockRes, siteLocationRules());
        const result = validationResult(mockReq);
        expected(result);
      });
    });
  });
});
