const { validationResult } = require('express-validator');
const validAppealDetails = require('./valid-appeal-details');

describe('validation/valid-appeal-details', () => {
  let req;
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  it('should pass validation when given a value', async () => {
    req = {
      body: {
        'valid-appeal-details': 'some really interesting details about a valid appeal',
      },
    };

    await validAppealDetails()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation when given no value', async () => {
    await validAppealDetails()(req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: undefined,
        msg: 'Enter a description of development',
        param: 'valid-appeal-details',
        location: 'body',
      },
    ]);
  });
});
