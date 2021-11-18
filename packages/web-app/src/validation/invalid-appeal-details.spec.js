const { validationResult } = require('express-validator');
const { invalidAppealDetailsValidation } = require('./invalid-appeal-details');

describe('validation/invalid-appeal-details', () => {
  let req;
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  const validators = invalidAppealDetailsValidation();

  it('should pass validation when given a value', async () => {
    req = {
      body: {
        'invalid-appeal-reasons': ['1', '5'],
        'other-reason': 'other description',
      },
    };

    validators.forEach(async (validator) => {
      await validator(req, res, next);
      const result = validationResult(req);

      expect(result.errors).toHaveLength(0);
    });
  });

  it('should fail validation when there is no reason', async () => {
    await validators[0](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: undefined,
        msg: 'Select why the appeal is invalid',
        param: 'invalid-appeal-reasons',
        location: 'body',
      },
    ]);
  });

  it('should fail validation if "other" option is chosen but there is no description', async () => {
    req = {
      body: {
        'invalid-appeal-reasons': ['1', '5'],
      },
    };

    await validators[1](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: undefined,
        msg: 'Enter why the appeal is invalid',
        param: 'other-reason',
        location: 'body',
      },
    ]);
  });

  it('should fail validation if request contains a reason with a wrong name', async () => {
    req = {
      body: {
        'invalid-appeal-reasons': ['noRightOfAppeal', '5'],
      },
    };

    await validators[0](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: req.body['invalid-appeal-reasons'],
        msg: 'Invalid option(s) received',
        param: 'invalid-appeal-reasons',
        location: 'body',
      },
    ]);
  });
});
