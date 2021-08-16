const { validationResult } = require('express-validator');
const reviewOutcome = require('./review-outcome');

describe('validation/review-outcome', () => {
  let req;
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  it('should pass validation when given a value of valid', async () => {
    req = {
      body: {
        'review-outcome': 'valid',
      },
    };

    await reviewOutcome()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should pass validation when given a value of invalid', async () => {
    req = {
      body: {
        'review-outcome': 'invalid',
      },
    };

    await reviewOutcome()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should pass validation when given a value of incomplete', async () => {
    req = {
      body: {
        'review-outcome': 'incomplete',
      },
    };

    await reviewOutcome()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation when given no value', async () => {
    await reviewOutcome()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: undefined,
        msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
        param: 'review-outcome',
        location: 'body',
      },
    ]);
  });

  it('should fail validation when given an empty string', async () => {
    req = {
      body: {
        'review-outcome': '',
      },
    };

    await reviewOutcome()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: '',
        msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
        param: 'review-outcome',
        location: 'body',
      },
    ]);
  });

  it('should fail validation when given an incorrect value', async () => {
    req = {
      body: {
        'review-outcome': 'pending',
      },
    };

    await reviewOutcome()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: 'pending',
        msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
        param: 'review-outcome',
        location: 'body',
      },
    ]);
  });
});
