const { validationResult } = require('express-validator');
const { checkAndConfirmValidation } = require('./check-and-confirm');
const { reviewOutcomeOption } = require('../config/review-appeal-submission');
const { hasAppeal } = require('../config/db-fields');

describe('validation/check-and-confirm', () => {
  let req;
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  const validator = checkAndConfirmValidation();

  it('should pass validation if reviewOutcome is not incomplete', async () => {
    req = {
      body: {},
      session: {},
    };

    await validator(req, res, next);

    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should pass validation if reviewOutcome is incomplete and completed checkbox is selected', async () => {
    req = {
      body: {
        'check-and-confirm-completed': 'true',
      },
      session: {
        casework: {
          [hasAppeal.reviewOutcome]: reviewOutcomeOption.incomplete,
        },
      },
    };

    await validator(req, res, next);

    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation if reviewOutcome is incomplete and completed checkbox is not selected', async () => {
    req = {
      body: {},
      session: {
        casework: {
          [hasAppeal.reviewOutcome]: reviewOutcomeOption.incomplete,
        },
      },
    };

    await validator(req, res, next);

    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: undefined,
        msg: 'Confirm if you have completed all follow-up tasks and emails',
        param: 'check-and-confirm-completed',
        location: 'body',
      },
    ]);
  });
});
