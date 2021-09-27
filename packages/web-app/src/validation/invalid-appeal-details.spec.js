const { validationResult } = require('express-validator');
const invalidAppealDetails = require('./invalid-appeal-details');

describe('validation/invalid-appeal-details', () => {
  let req;
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  it('should pass validation when given a value', async () => {
    req = {
      body: {
        'invalid-appeal-reasons': ['other', 'outOfTime'],
        'other-by-text': 'other description',
      },
    };

    await invalidAppealDetails()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation when there is no reason', async () => {
    await invalidAppealDetails()(req, res, next);
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
        'invalid-appeal-reasons': ['other', 'outOfTime'],
      },
    };

    await invalidAppealDetails()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: req.body['invalid-appeal-reasons'],
        msg: 'Enter why the appeal is invalid',
        param: 'invalid-appeal-reasons',
        location: 'body',
      },
    ]);
  });
});
