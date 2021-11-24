const { validationResult } = require('express-validator');
const { missingOrWrongAppealDetailsValidation } = require('./missing-or-wrong');

describe('validation/missing-or-wrong', () => {
  let req;
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  const validators = missingOrWrongAppealDetailsValidation();

  it('should pass validation when given a value', async () => {
    req = {
      body: {
        'missing-or-wrong-reasons': ['3', '7'],
        'missing-or-wrong-documents': '1',
        'other-reason': 'other description',
      },
    };

    validators.forEach(async (validator) => {
      await validator(req, res, next);
    });

    const result = validationResult(req);

    expect(result.errors).toHaveLength(0);
  });

  it('should fail validation when there is no reason', async () => {
    await validators[0](req, res, next);

    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: undefined,
        msg: 'Select what is missing or wrong in the appeal submission',
        param: 'missing-or-wrong-reasons',
        location: 'body',
      },
    ]);
  });

  it('should fail validation if "other" option is chosen but there is no description', async () => {
    req = {
      body: {
        'missing-or-wrong-reasons': ['7'],
      },
    };

    await validators[2](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: req.body['other-reason'],
        msg: 'Enter what is missing or wrong in the appeal submission',
        param: 'other-reason',
        location: 'body',
      },
    ]);
  });

  it('should fail validation if "missingOrWrongDocuments" option is chosen but no sub option selected', async () => {
    req = {
      body: {
        'missing-or-wrong-reasons': ['3'],
      },
    };

    await validators[1](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: req.body['missing-or-wrong-documents'],
        msg: 'Select which documents are missing or wrong',
        param: 'missing-or-wrong-documents',
        location: 'body',
      },
    ]);
  });

  it('should fail validation if request contains a reason with an incorrect value', async () => {
    req = {
      body: {
        'missing-or-wrong-reasons': ['8'],
      },
    };

    await validators[0](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: req.body['missing-or-wrong-reasons'],
        msg: 'Invalid option(s) received',
        param: 'missing-or-wrong-reasons',
        location: 'body',
      },
    ]);
  });

  it('should fail validation if request contains a document reason with an incorrect value', async () => {
    req = {
      body: {
        'missing-or-wrong-documents': ['5'],
      },
    };

    await validators[1](req, res, next);
    const result = validationResult(req);

    expect(result.errors).toHaveLength(1);
    expect(result.errors).toEqual([
      {
        value: req.body['missing-or-wrong-documents'],
        msg: 'Invalid option(s) received',
        param: 'missing-or-wrong-documents',
        location: 'body',
      },
    ]);
  });
});
